import { useState, useEffect, useCallback } from 'react';
import {
  UserAccount,
  UserRole,
  UserSearchField,
  LoginCredentials,
  AlunoRegistrationInput,
  RoleVerificationToken
} from '../types';
import { defaultUsers, defaultRoleTokens } from '../data/mockData';
import {
  getEncryptedItem,
  setEncryptedItem,
  clearAllLocalStorage
} from '../utils/cryptoStorage';

const USERS_STORAGE_KEY = 'studyMap_users';
const SESSION_STORAGE_KEY = 'studyMap_currentUser';
const TOKENS_STORAGE_KEY = 'studyMap_roleTokens';

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function loadInitialUsers(): UserAccount[] {
  const storedUsers = getEncryptedItem<UserAccount[] | null>(USERS_STORAGE_KEY, null);
  if (Array.isArray(storedUsers) && storedUsers.length > 0) {
    return storedUsers;
  }
  return defaultUsers;
}

function loadInitialTokens(): RoleVerificationToken[] {
  const storedTokens = getEncryptedItem<RoleVerificationToken[] | null>(TOKENS_STORAGE_KEY, null);
  if (Array.isArray(storedTokens) && storedTokens.length > 0) {
    return storedTokens;
  }
  return defaultRoleTokens;
}

function loadInitialSession(users: UserAccount[]): UserAccount | null {
  const storedSession = getEncryptedItem<UserAccount | null>(SESSION_STORAGE_KEY, null);
  if (!storedSession) return null;

  const matched = users.find(
    (u) => u.id === storedSession.id && u.email.toLowerCase() === storedSession.email.toLowerCase()
  );
  return matched || null;
}

export function useAuth() {
  const [users, setUsers] = useState<UserAccount[]>(() => loadInitialUsers());
  const [roleTokens, setRoleTokens] = useState<RoleVerificationToken[]>(() => loadInitialTokens());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadInitialSession(loadInitialUsers())
  );

  // Persistir dados criptografados no LocalStorage apenas enquanto houver sessão em uso
  useEffect(() => {
    if (currentUser) {
      setEncryptedItem(USERS_STORAGE_KEY, users);
      setEncryptedItem(SESSION_STORAGE_KEY, currentUser);
      setEncryptedItem(TOKENS_STORAGE_KEY, roleTokens);
    }
  }, [users, currentUser, roleTokens]);

  // Login unificado apenas com E-mail e Senha
  const login = useCallback(
    (credentials: LoginCredentials): { success: boolean; message: string; user?: UserAccount } => {
      const emailNormalized = credentials.email.trim().toLowerCase();
      const senha = credentials.senha;

      if (!emailNormalized || !senha) {
        return {
          success: false,
          message: 'Informe seu e-mail e sua senha para entrar.'
        };
      }

      const matchedUser = users.find(
        (u) => u.email.trim().toLowerCase() === emailNormalized && u.senha === senha
      );

      if (!matchedUser) {
        return {
          success: false,
          message: 'E-mail ou senha incorretos. Confira os dados informados.'
        };
      }

      const roleLabels: Record<UserRole, string> = {
        aluno: 'Aluno',
        monitor: 'Monitor',
        admin: 'Administrador'
      };

      setCurrentUser(matchedUser);
      return {
        success: true,
        user: matchedUser,
        message: `Bem-vindo(a), ${matchedUser.nome}! Sessão iniciada com perfil de ${roleLabels[matchedUser.perfil]}.`
      };
    },
    [users]
  );

  // Encerrar sessão atual e apagar todos os dados salvos no LocalStorage
  const logout = useCallback(() => {
    setCurrentUser(null);
    setUsers(defaultUsers);
    setRoleTokens(defaultRoleTokens);
    clearAllLocalStorage();
  }, []);

  // Cadastro inicial: todo novo usuário entra com perfil de Aluno ("aluno")
  const registerAluno = useCallback(
    (input: AlunoRegistrationInput): { success: boolean; message: string; user?: UserAccount } => {
      const nome = input.nome.trim();
      const matricula = input.matricula.trim();
      const emailNormalized = input.email.trim().toLowerCase();
      const senha = input.senha;

      if (!nome || !matricula || !emailNormalized || !senha) {
        return {
          success: false,
          message: 'Preencha todos os campos obrigatórios: nome completo, matrícula, e-mail e senha.'
        };
      }

      if (senha.length < 6) {
        return {
          success: false,
          message: 'A senha deve possuir pelo menos 6 caracteres.'
        };
      }

      // Regra: os e-mails devem ser diferentes em todo o sistema
      const emailAlreadyExists = users.some(
        (u) => u.email.trim().toLowerCase() === emailNormalized
      );
      if (emailAlreadyExists) {
        return {
          success: false,
          message: 'Já existe um usuário cadastrado com este endereço de e-mail. Os e-mails devem ser diferentes.'
        };
      }

      // Validar unicidade da matrícula
      const matriculaAlreadyExists = users.some(
        (u) => (u.matricula || '').trim().toLowerCase() === matricula.toLowerCase()
      );
      if (matriculaAlreadyExists) {
        return {
          success: false,
          message: 'Este número de matrícula já está vinculado a outro cadastro no sistema.'
        };
      }

      const newUser: UserAccount = {
        id: Date.now(),
        nome,
        matricula,
        email: emailNormalized,
        senha,
        perfil: 'aluno',
        criadoEm: new Date().toISOString()
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);

      return {
        success: true,
        user: newUser,
        message: `Cadastro realizado com sucesso! Bem-vindo(a), ${newUser.nome}. Seu perfil inicial é Aluno.`
      };
    },
    [users]
  );

  // Validar token disponibilizado pelo Admin 1 nas Configurações para alterar o perfil para Monitor ou Administrador
  const applyRoleToken = useCallback(
    (
      codigoInput: string,
      initialSpace?: { id: number; nome: string }
    ): { success: boolean; message: string; newRole?: UserRole } => {
      if (!currentUser) {
        return {
          success: false,
          message: 'Você precisa estar autenticado para validar um token de perfil.'
        };
      }

      const normalizedCode = codigoInput.trim().toUpperCase();
      if (!normalizedCode) {
        return {
          success: false,
          message: 'Digite o token disponibilizado pelo Admin 1 (Coordenação Geral).'
        };
      }

      const matchedToken = roleTokens.find(
        (t) => t.codigo.trim().toUpperCase() === normalizedCode
      );

      if (!matchedToken) {
        return {
          success: false,
          message: 'Token inválido ou inexistente. Confira o código disponibilizado pelo Admin 1.'
        };
      }

      if (
        matchedToken.usadoPorEmail &&
        matchedToken.usadoPorEmail.toLowerCase() !== currentUser.email.toLowerCase()
      ) {
        return {
          success: false,
          message: `Este token (${matchedToken.codigo}) já foi vinculado a outra conta. Utilize um token livre disponibilizado pelo Admin 1.`
        };
      }

      const targetRole: UserRole = matchedToken.perfilDestino;
      const roleLabel = targetRole === 'admin' ? 'Administrador' : 'Monitor';

      const defaultMonitorSpaceId = initialSpace?.id ?? currentUser.espacoMonitoriaId ?? 1;
      const defaultMonitorSpaceName =
        initialSpace?.nome ??
        currentUser.espacoMonitoria ??
        'Biblioteca Central — Salão Silencioso';

      const updatedUser: UserAccount = {
        ...currentUser,
        perfil: targetRole,
        token: matchedToken.codigo,
        ...(targetRole === 'monitor'
          ? {
              espacoMonitoriaId: defaultMonitorSpaceId,
              espacoMonitoria: defaultMonitorSpaceName
            }
          : {})
      };

      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
      setCurrentUser(updatedUser);
      setRoleTokens((prev) =>
        prev.map((t) =>
          t.codigo.toUpperCase() === normalizedCode
            ? {
                ...t,
                usadoPorEmail: currentUser.email,
                usadoEm: new Date().toISOString()
              }
            : t
        )
      );

      return {
        success: true,
        newRole: targetRole,
        message:
          targetRole === 'monitor'
            ? `Token ${matchedToken.codigo} (emitido por ${matchedToken.criadoPor}) validado! Seu perfil agora é ${roleLabel}, registrado em "${defaultMonitorSpaceName}".`
            : `Token ${matchedToken.codigo} (emitido por ${matchedToken.criadoPor}) validado com sucesso! Seu perfil foi alterado para ${roleLabel}.`
      };
    },
    [currentUser, roleTokens]
  );

  // Atualizar o local onde o Monitor está registrado
  const updateMonitorRegisteredSpace = useCallback(
    (espacoId: number, espacoNome: string): { success: boolean; message: string } => {
      if (!currentUser) {
        return {
          success: false,
          message: 'Nenhum usuário autenticado na sessão atual.'
        };
      }

      const updatedUser: UserAccount = {
        ...currentUser,
        espacoMonitoriaId: espacoId,
        espacoMonitoria: espacoNome
      };

      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
      setCurrentUser(updatedUser);

      return {
        success: true,
        message: `Local de registro da monitoria atualizado para "${espacoNome}".`
      };
    },
    [currentUser]
  );

  // Etapa 1 da Recuperação de Senha: validar identidade (e-mail + matrícula ou token)
  const verifyRecoveryIdentity = useCallback(
    (email: string, identificador: string): { success: boolean; message: string; user?: UserAccount } => {
      const emailNormalized = email.trim().toLowerCase();
      const idNormalized = identificador.trim().toLowerCase();

      if (!emailNormalized || !idNormalized) {
        return {
          success: false,
          message: 'Informe seu e-mail cadastrado e o número da matrícula (ou token) para validar sua identidade.'
        };
      }

      const matched = users.find((u) => {
        if (u.email.trim().toLowerCase() !== emailNormalized) return false;
        const matMatch = (u.matricula || '').trim().toLowerCase() === idNormalized;
        const tokMatch = (u.token || '').trim().toLowerCase() === idNormalized;
        return matMatch || tokMatch;
      });

      if (!matched) {
        return {
          success: false,
          message: 'Não encontramos uma conta correspondente ao e-mail e identificador informados.'
        };
      }

      return {
        success: true,
        user: matched,
        message: `Identidade confirmada para ${matched.nome}. Defina sua nova senha abaixo.`
      };
    },
    [users]
  );

  // Etapa 2 da Recuperação de Senha: gravar nova senha
  const resetPassword = useCallback(
    (email: string, identificador: string, novaSenha: string): { success: boolean; message: string } => {
      if (!novaSenha || novaSenha.length < 6) {
        return {
          success: false,
          message: 'A nova senha deve conter no mínimo 6 caracteres.'
        };
      }

      const verification = verifyRecoveryIdentity(email, identificador);
      if (!verification.success || !verification.user) {
        return {
          success: false,
          message: verification.message
        };
      }

      const targetId = verification.user.id;
      setUsers((prev) => {
        const nextUsers = prev.map((u) => (u.id === targetId ? { ...u, senha: novaSenha } : u));
        if (typeof window !== 'undefined' && localStorage.getItem(USERS_STORAGE_KEY) !== null) {
          setEncryptedItem(USERS_STORAGE_KEY, nextUsers);
        }
        return nextUsers;
      });

      setCurrentUser((prev) =>
        prev && prev.id === targetId ? { ...prev, senha: novaSenha } : prev
      );

      return {
        success: true,
        message: 'Senha redefinida com sucesso! Agora você já pode realizar o login com a nova senha.'
      };
    },
    [verifyRecoveryIdentity]
  );

  // Atualizar senha do usuário atualmente autenticado
  const updateCurrentPassword = useCallback(
    (novaSenha: string): { success: boolean; message: string } => {
      if (!currentUser) {
        return {
          success: false,
          message: 'Nenhum usuário autenticado na sessão atual.'
        };
      }

      if (!novaSenha || novaSenha.length < 6) {
        return {
          success: false,
          message: 'A nova senha deve possuir no mínimo 6 caracteres.'
        };
      }

      if (novaSenha === currentUser.senha) {
        return {
          success: false,
          message: 'A nova senha deve ser diferente da senha atual.'
        };
      }

      const updatedUser: UserAccount = { ...currentUser, senha: novaSenha };
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
      setCurrentUser(updatedUser);

      return {
        success: true,
        message: 'Sua senha de acesso foi atualizada com sucesso!'
      };
    },
    [currentUser]
  );

  // Busca pela matrícula, nome e e-mail (com filtro opcional por campo e perfil)
  const searchUsers = useCallback(
    (
      query: string,
      field: UserSearchField = 'todos',
      roleFilter: UserRole | 'todos' = 'todos'
    ): UserAccount[] => {
      const normalizedQuery = normalizeText(query);

      return users.filter((user) => {
        if (roleFilter !== 'todos' && user.perfil !== roleFilter) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const matriculaNormalized = normalizeText(user.matricula || '');
        const nomeNormalized = normalizeText(user.nome);
        const emailNormalized = normalizeText(user.email);

        if (field === 'matricula') {
          return matriculaNormalized.includes(normalizedQuery);
        }
        if (field === 'nome') {
          return nomeNormalized.includes(normalizedQuery);
        }
        if (field === 'email') {
          return emailNormalized.includes(normalizedQuery);
        }

        return (
          matriculaNormalized.includes(normalizedQuery) ||
          nomeNormalized.includes(normalizedQuery) ||
          emailNormalized.includes(normalizedQuery)
        );
      });
    },
    [users]
  );

  // Passo 4 (Item 1): Cadastrar novo aluno (ou usuário) pelo Administrador sem trocar a sessão ativa
  const adminCreateUser = useCallback(
    (input: {
      nome: string;
      matricula: string;
      email: string;
      senha: string;
      perfil?: UserRole;
      token?: string;
      espacoMonitoriaId?: number;
      espacoMonitoria?: string;
    }): { success: boolean; message: string; user?: UserAccount } => {
      const nome = input.nome.trim();
      const matricula = input.matricula.trim();
      const emailNormalized = input.email.trim().toLowerCase();
      const senha = input.senha;
      const perfil: UserRole = input.perfil || 'aluno';

      if (!nome || !matricula || !emailNormalized || !senha) {
        return {
          success: false,
          message: 'Preencha todos os campos obrigatórios: nome completo, matrícula, e-mail e senha.'
        };
      }

      if (senha.length < 6) {
        return {
          success: false,
          message: 'A senha deve possuir no mínimo 6 caracteres.'
        };
      }

      const emailAlreadyExists = users.some(
        (u) => u.email.trim().toLowerCase() === emailNormalized
      );
      if (emailAlreadyExists) {
        return {
          success: false,
          message: 'Já existe uma conta cadastrada com este e-mail. Os e-mails devem ser diferentes.'
        };
      }

      const matriculaAlreadyExists = users.some(
        (u) => (u.matricula || '').trim().toLowerCase() === matricula.toLowerCase()
      );
      if (matriculaAlreadyExists) {
        return {
          success: false,
          message: 'Este número de matrícula já está vinculado a outro usuário no sistema.'
        };
      }

      const newUser: UserAccount = {
        id: Date.now(),
        nome,
        matricula,
        email: emailNormalized,
        senha,
        perfil,
        token: input.token?.trim() ? input.token.trim().toUpperCase() : undefined,
        espacoMonitoriaId: perfil === 'monitor' ? input.espacoMonitoriaId : undefined,
        espacoMonitoria: perfil === 'monitor' ? input.espacoMonitoria : undefined,
        criadoEm: new Date().toISOString()
      };

      setUsers((prev) => [newUser, ...prev]);

      const roleLabel =
        perfil === 'admin' ? 'Administrador' : perfil === 'monitor' ? 'Monitor' : 'Aluno';

      return {
        success: true,
        user: newUser,
        message: `Novo cadastro de ${roleLabel} realizado com sucesso para ${newUser.nome} (${newUser.email})!`
      };
    },
    [users]
  );

  // Passo 4 (Item 3): Atualizar dados de qualquer usuário do sistema
  const adminUpdateUser = useCallback(
    (
      userId: number,
      updates: {
        nome: string;
        email: string;
        senha: string;
        perfil: UserRole;
        matricula?: string;
        token?: string;
        espacoMonitoriaId?: number;
        espacoMonitoria?: string;
      }
    ): { success: boolean; message: string } => {
      const existing = users.find((u) => u.id === userId);
      if (!existing) {
        return { success: false, message: 'Usuário não encontrado no sistema.' };
      }

      const nome = updates.nome.trim();
      const emailNormalized = updates.email.trim().toLowerCase();
      const matricula = (updates.matricula || '').trim();
      const senha = updates.senha;

      if (!nome || !emailNormalized || !senha) {
        return {
          success: false,
          message: 'Nome, e-mail e senha são obrigatórios para atualizar o usuário.'
        };
      }

      if (senha.length < 6) {
        return {
          success: false,
          message: 'A senha deve possuir no mínimo 6 caracteres.'
        };
      }

      const duplicateEmail = users.some(
        (u) => u.id !== userId && u.email.trim().toLowerCase() === emailNormalized
      );
      if (duplicateEmail) {
        return {
          success: false,
          message: 'Outro usuário já utiliza este endereço de e-mail. Os e-mails devem ser diferentes.'
        };
      }

      if (matricula) {
        const duplicateMatricula = users.some(
          (u) =>
            u.id !== userId &&
            (u.matricula || '').trim().toLowerCase() === matricula.toLowerCase()
        );
        if (duplicateMatricula) {
          return {
            success: false,
            message: 'Outro usuário já utiliza este número de matrícula.'
          };
        }
      }

      const updatedUser: UserAccount = {
        ...existing,
        nome,
        email: emailNormalized,
        senha,
        perfil: updates.perfil,
        matricula: matricula || undefined,
        token: updates.token?.trim() ? updates.token.trim().toUpperCase() : undefined,
        espacoMonitoriaId:
          updates.perfil === 'monitor' ? updates.espacoMonitoriaId : undefined,
        espacoMonitoria:
          updates.perfil === 'monitor' ? updates.espacoMonitoria : undefined
      };

      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));

      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
      }

      return {
        success: true,
        message: `Cadastro de "${updatedUser.nome}" atualizado com sucesso!`
      };
    },
    [users, currentUser]
  );

  // Passo 4 (Item 4): Remover usuário do sistema
  const adminDeleteUser = useCallback(
    (userId: number): { success: boolean; message: string } => {
      const target = users.find((u) => u.id === userId);
      if (!target) {
        return { success: false, message: 'Usuário não encontrado.' };
      }

      if (currentUser && currentUser.id === userId) {
        return {
          success: false,
          message: 'Não é possível remover a própria conta de Administrador atualmente autenticada na sessão.'
        };
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setRoleTokens((prev) =>
        prev.map((t) =>
          t.usadoPorEmail && t.usadoPorEmail.toLowerCase() === target.email.toLowerCase()
            ? { ...t, usadoPorEmail: undefined, usadoEm: undefined }
            : t
        )
      );

      return {
        success: true,
        message: `Usuário "${target.nome}" (${target.email}) removido do sistema com sucesso.`
      };
    },
    [users, currentUser]
  );

  // Passo 4 (Item 1): Gerar novo token de verificação de Monitor e novos ADMs
  const adminGenerateRoleToken = useCallback(
    (input: {
      codigo?: string;
      perfilDestino: 'monitor' | 'admin';
      descricao: string;
      criadoPor?: string;
    }): { success: boolean; message: string; token?: RoleVerificationToken } => {
      const prefix = input.perfilDestino === 'admin' ? 'ADM' : 'MON';
      const year = new Date().getFullYear();

      let finalCode = (input.codigo || '').trim().toUpperCase();
      if (!finalCode) {
        let candidateNum = 300 + roleTokens.length + 1;
        while (
          roleTokens.some(
            (t) => t.codigo.toUpperCase() === `${prefix}-${year}-${candidateNum}`
          )
        ) {
          candidateNum += 1;
        }
        finalCode = `${prefix}-${year}-${candidateNum}`;
      }

      const codeAlreadyExists = roleTokens.some(
        (t) => t.codigo.trim().toUpperCase() === finalCode
      );
      if (codeAlreadyExists) {
        return {
          success: false,
          message: `Já existe um token cadastrado com o código "${finalCode}". Escolha outro código ou gere automaticamente.`
        };
      }

      const descricaoLimpa =
        input.descricao.trim() ||
        (input.perfilDestino === 'admin'
          ? 'Token de habilitação para novo Administrador'
          : 'Token de habilitação para novo Monitor');

      const newToken: RoleVerificationToken = {
        codigo: finalCode,
        perfilDestino: input.perfilDestino,
        descricao: descricaoLimpa,
        criadoPor: input.criadoPor?.trim() || currentUser?.nome || 'Administração'
      };

      setRoleTokens((prev) => [newToken, ...prev]);

      return {
        success: true,
        token: newToken,
        message: `Token ${newToken.codigo} (${
          input.perfilDestino === 'admin' ? 'Novo Administrador' : 'Novo Monitor'
        }) gerado com sucesso!`
      };
    },
    [roleTokens, currentUser]
  );

  // Passo 4 (Item 3): Atualizar token de verificação existente
  const adminUpdateRoleToken = useCallback(
    (
      originalCodigo: string,
      updates: {
        codigo: string;
        perfilDestino: 'monitor' | 'admin';
        descricao: string;
        liberarVinculo?: boolean;
      }
    ): { success: boolean; message: string } => {
      const normalizedOrig = originalCodigo.trim().toUpperCase();
      const existing = roleTokens.find(
        (t) => t.codigo.trim().toUpperCase() === normalizedOrig
      );
      if (!existing) {
        return { success: false, message: 'Token não encontrado.' };
      }

      const nextCode = updates.codigo.trim().toUpperCase();
      if (!nextCode) {
        return { success: false, message: 'O código do token não pode ficar vazio.' };
      }

      const duplicate = roleTokens.some(
        (t) =>
          t.codigo.trim().toUpperCase() !== normalizedOrig &&
          t.codigo.trim().toUpperCase() === nextCode
      );
      if (duplicate) {
        return {
          success: false,
          message: `Já existe outro token com o código "${nextCode}".`
        };
      }

      const updatedToken: RoleVerificationToken = {
        ...existing,
        codigo: nextCode,
        perfilDestino: updates.perfilDestino,
        descricao: updates.descricao.trim() || existing.descricao,
        usadoPorEmail: updates.liberarVinculo ? undefined : existing.usadoPorEmail,
        usadoEm: updates.liberarVinculo ? undefined : existing.usadoEm
      };

      setRoleTokens((prev) =>
        prev.map((t) =>
          t.codigo.trim().toUpperCase() === normalizedOrig ? updatedToken : t
        )
      );

      return {
        success: true,
        message: `Token "${updatedToken.codigo}" atualizado com sucesso!`
      };
    },
    [roleTokens]
  );

  // Passo 4 (Item 4): Remover token do sistema
  const adminDeleteRoleToken = useCallback(
    (codigo: string): { success: boolean; message: string } => {
      const normalized = codigo.trim().toUpperCase();
      const exists = roleTokens.some(
        (t) => t.codigo.trim().toUpperCase() === normalized
      );
      if (!exists) {
        return { success: false, message: 'Token não encontrado.' };
      }

      setRoleTokens((prev) =>
        prev.filter((t) => t.codigo.trim().toUpperCase() !== normalized)
      );

      return {
        success: true,
        message: `Token "${normalized}" removido do sistema.`
      };
    },
    [roleTokens]
  );

  const resetAuthStorage = useCallback(() => {
    setUsers(defaultUsers);
    setRoleTokens(defaultRoleTokens);
    setCurrentUser(null);
    clearAllLocalStorage();
  }, []);

  return {
    users,
    roleTokens,
    currentUser,
    login,
    logout,
    registerAluno,
    applyRoleToken,
    updateMonitorRegisteredSpace,
    verifyRecoveryIdentity,
    resetPassword,
    updateCurrentPassword,
    searchUsers,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    adminGenerateRoleToken,
    adminUpdateRoleToken,
    adminDeleteRoleToken,
    resetAuthStorage
  };
}
