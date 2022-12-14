import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Forms.module.css";
import {
  db,
  auth,
  setDoc,
  doc,
  createUserWithEmailAndPassword,
} from "../../firebase/firebase";
import { UserContext } from "../../App";

const RegisterForm = ({ onOpenModal, handleError }) => {
  const context = useContext(UserContext);

  let navigate = useNavigate();

  const handleRegister = (e) => {
    const email = context.email;
    const password = context.password;
    const name = context.name;
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        if (user) {
          await setDoc(doc(db, "users", uid), {
            name,
            email,
          });
          navigate("/login");
        }
      })
      .catch((error) => {
        onOpenModal(true);
        switch (error.code) {
          case "auth/email-already-in-use":
            handleError("Email en uso");
            break;
          case "auth/invalid-email":
            handleError("Proporcione una dirección de correo válida");
            break;
          case "auth/internal-error":
            handleError("El ingreso de contraseña es obligatorio");
            break;
          case "auth/weak-password":
            handleError("Tu contraseña debe tener al menos 6 caracteres");
            break;
          default:
            handleError("Algo ocurrió, vuelve a intentarlo");
            break;
        }
        context.setEmail("");
        context.setPassword("");
      });
  };

  return (
    <form onSubmit={handleRegister}>
      <h1> Regístrate </h1>
      <p className={style.message}>Por favor registrate para iniciar sesión.</p>
      <label htmlFor="name">Nombre</label>
      <input
        placeholder="John Doe"
        value={context.name}
        onChange={(e) => context.setName(e.target.value)}
      />
      <label htmlFor="email">Correo electrónico</label>
      <input
        placeholder="email@example.com"
        value={context.email}
        onChange={(e) => context.setEmail(e.target.value)}
      />
      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        placeholder="******"
        value={context.password}
        onChange={(e) => context.setPassword(e.target.value)}
      />
      <button className="mainButton" type="submit">
        Registrarme
      </button>
    </form>
  );
};

export { RegisterForm };
