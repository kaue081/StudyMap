"use client";

import React from "react";
import { useStudyMap } from "../../context/StudyMapContext";
import { LoginScreen } from "../../components/LoginScreen";

export default function LoginPage() {
  const { login, showAlert } = useStudyMap();

  return (
    <LoginScreen
      onLogin={(credentials) => {
        const res = login(credentials);
        showAlert({
          variant: res.success ? "success" : "error",
          title: res.success ? "Login Realizado" : "Falha no Login",
          message: res.message
        });
        return res;
      }}
    />
  );
}
