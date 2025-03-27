import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [confettiActive, setConfettiActive] = useState(true);
  const [particles, setParticles] = useState([]);

  // Generate random confetti particles
  useEffect(() => {
    if (confettiActive) {
      const colors = [
        '#f94144', '#f3722c', '#f8961e', '#f9c74f', 
        '#90be6d', '#43aa8b', '#4d908e', '#577590', 
        '#277da1', '#9b5de5', '#f15bb5'
      ];
      
      const newParticles = [];
      for (let i = 0; i < 150; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 100,
          size: 5 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          speed: 2 + Math.random() * 4
        });
      }
      
      setParticles(newParticles);
      
      // Add keyframes for animations
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          100% { transform: translateY(1000px) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes wave {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `;
      document.head.appendChild(styleEl);
      
      // Set animation complete after delay
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 1000);
      
      // Stop confetti after some time
      const confettiTimer = setTimeout(() => {
        setConfettiActive(false);
      }, 8000);
      
      return () => {
        document.head.removeChild(styleEl);
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [confettiActive]);

  // Styles
  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
    },
    card: {
      position: 'relative',
      maxWidth: '600px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '3rem 2rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      zIndex: 10,
      overflow: 'hidden',
      animation: animationComplete ? 'pulse 3s infinite ease-in-out' : 'none',
    },
    successIcon: {
      width: '120px',
      height: '120px',
      margin: '0 auto 1.5rem',
      position: 'relative',
      animation: animationComplete ? 'bounce 2s ease 1s' : 'none',
    },
    circle: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: '#4CAF50',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 10px 20px rgba(76, 175, 80, 0.3)',
    },
    checkmark: {
      width: '60px',
      height: '30px',
      borderBottom: '8px solid white',
      borderRight: '8px solid white',
      transform: 'rotate(45deg) translate(-5px, -5px)',
      marginTop: '-10px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '1rem',
      background: 'linear-gradient(90deg, #4b6cb7, #182848)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      opacity: 0,
      animation: animationComplete ? 'fadeInUp 0.8s forwards' : 'none',
    },
    message: {
      fontSize: '1.2rem',
      color: '#4a5568',
      marginBottom: '2rem',
      lineHeight: 1.6,
      opacity: 0,
      animation: animationComplete ? 'fadeInUp 0.8s 0.3s forwards' : 'none',
    },
    button: {
      display: 'inline-block',
      padding: '0.8rem 2rem',
      backgroundColor: '#4CAF50',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
      transition: 'all 0.3s ease',
      opacity: 0,
      animation: animationComplete ? 'fadeInUp 0.8s 0.6s forwards' : 'none',
    },
    buttonHover: {
      backgroundColor: '#3d8b40',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(76, 175, 80, 0.6)',
    },
    confetti: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none',
    },
    confettiPiece: {
      position: 'absolute',
      width: '10px',
      height: '10px',
      zIndex: 1,
    },
    orderNumber: {
      fontSize: '1rem',
      color: '#718096',
      marginBottom: '2rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      display: 'inline-block',
      opacity: 0,
      animation: animationComplete ? 'fadeInUp 0.8s 0.4s forwards' : 'none',
    },
    shine: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      animation: 'wave 2s infinite',
    },
    trophy: {
      position: 'absolute',
      top: '-30px',
      right: '-30px',
      width: '100px',
      height: '100px',
      background: 'radial-gradient(circle, #FFD700, #FFA500)',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 5px 15px rgba(255, 215, 0, 0.5)',
      opacity: 0,
      animation: animationComplete ? 'fadeInUp 0.8s 0.7s forwards' : 'none',
      zIndex: 5,
    },
    trophyIcon: {
      fontSize: '40px',
      color: 'white',
    },
    // Responsive styles
    responsiveContainer: {
      padding: '1rem',
    },
    responsiveCard: {
      padding: '2rem 1rem',
    },
    responsiveTitle: {
      fontSize: '2rem',
    },
  };

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768;
  
  // Button hover state
  const [isHovered, setIsHovered] = useState(false);

  // Generate random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return (
    <div style={styles.container}>
      {/* Confetti Animation */}
      <div style={styles.confetti}>
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              ...styles.confettiPiece,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
              animation: `float ${5 / particle.speed}s linear forwards`,
            }}
          />
        ))}
      </div>
      
      <div style={isMobile ? {...styles.card, ...styles.responsiveCard} : styles.card}>
        <div style={styles.shine}></div>
        
        <div style={styles.trophy}>
          <span style={styles.trophyIcon}>🏆</span>
        </div>
        
        <div style={styles.successIcon}>
          <div style={styles.circle}>
            <div style={styles.checkmark}></div>
          </div>
        </div>
        
        <h1 style={isMobile ? {...styles.title, ...styles.responsiveTitle} : styles.title}>
          Thank You for Your Purchase!
        </h1>
        
        <div style={styles.orderNumber}>
          Order #{orderNumber}
        </div>
        
        <p style={styles.message}>
          Your transaction has been completed successfully. Your book is now ready for you to enjoy!
          We hope you have a wonderful reading experience.
        </p>
        
        <button 
          style={isHovered ? {...styles.button, ...styles.buttonHover} : styles.button}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => navigate('/admin/AddDelivery')}
        >
          Proceed to Dilivery
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;