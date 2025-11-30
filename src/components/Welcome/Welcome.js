import React, { useState, useEffect } from 'react';
import './Welcome.css';

const TypedText = ({ text, onFinished, speed = 50 }) => {
    const [typed, setTyped] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTyped((prev) => {
                if (prev.length === text.length) {
                    clearInterval(interval);
                    return prev;
                }
                return text.substring(0, prev.length + 1);
            });
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    // Call onFinished in a separate effect when typing is complete
    useEffect(() => {
        if (typed.length === text.length && typed.length > 0 && onFinished) {
            onFinished();
        }
    }, [typed, text, onFinished]);

    const isFinished = typed.length === text.length;

    return (
        <p className="console-line">
            <span className="console-prompt">&gt;</span>
            {typed}
            {!isFinished && <span className="cursor">_</span>}
        </p>
    );
};


const Welcome = ({ nombre = 'Usuario' }) => {
  const isDev = nombre === 'Desarrollador';
  const [step, setStep] = useState(0);

  const line1 = `Bienvenido, ${nombre}!`;
  const line2 = isDev
    ? '¡Eres un crack! Gracias por probar esta aplicación modular.'
    : 'Aquí encontrarás tus tareas, el directorio de usuarios y herramientas útiles para tu flujo de trabajo.';

  return (
    <section className="welcome-console" aria-label="Bienvenida">
      <div className="console-content">
        <TypedText text={line1} onFinished={() => setStep(1)} />
        {step >= 1 && <TypedText text={line2} onFinished={() => setStep(2)} speed={30} />}
        {step >= 2 && (
            <p className="console-line">
                <span className="console-prompt">&gt;</span>
                <a className="welcome-cta" href="#/tareas">Ver mis tareas</a>
                <span className="cursor">_</span>
            </p>
        )}
      </div>
    </section>
  );
};

export default Welcome;
