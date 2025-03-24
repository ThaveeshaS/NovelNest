import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book;

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: ''
  });
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardType, setCardType] = useState('');
  const [formTouched, setFormTouched] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false,
    email: false
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { transform: translateX(-30px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      @keyframes rotate {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(180deg); }
      }
      @keyframes rotateBack {
        0% { transform: rotateY(180deg); }
        100% { transform: rotateY(0deg); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    if (!book) {
      navigate('/');
      showNotification('No book selected. Please use voice input on the home page.', 'error');
    } else {
      setTimeout(() => setPageLoaded(true), 100);
    }
  }, [book, navigate]);

  useEffect(() => {
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    
    if (cardNumber.startsWith('4')) {
      setCardType('visa');
    } else if (/^5[1-5]/.test(cardNumber)) {
      setCardType('mastercard');
    } else if (/^3[47]/.test(cardNumber)) {
      setCardType('amex');
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      setCardType('discover');
    } else {
      setCardType('');
    }
  }, [formData.cardNumber]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'cardNumber':
        const cardNumberClean = value.replace(/\s/g, '');
        if (!cardNumberClean) {
          errorMessage = 'Card number is required';
        } else if (!/^\d+$/.test(cardNumberClean)) {
          errorMessage = 'Card number must contain only digits';
        } else if (cardNumberClean.length < 15 || cardNumberClean.length > 16) {
          errorMessage = 'Card number must be 15-16 digits';
        }
        break;
        
      case 'expiry':
        if (!value) {
          errorMessage = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(value)) {
          errorMessage = 'Expiry date must be in MM/YY format';
        } else {
          const [month, year] = value.split('/');
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;
          
          if (parseInt(month) < 1 || parseInt(month) > 12) {
            errorMessage = 'Month must be between 01-12';
          } else if (
            (parseInt(year) < currentYear) || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)
          ) {
            errorMessage = 'Card has expired';
          }
        }
        break;
        
      case 'cvv':
        if (!value) {
          errorMessage = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(value)) {
          errorMessage = 'CVV must be 3-4 digits';
        }
        break;
        
      case 'email':
        if (!value) {
          errorMessage = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
        
      default:
        break;
    }
    
    return errorMessage;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (name === 'expiry') {
      value = formatExpiry(value);
    } else if (name === 'cvv') {
      value = value.replace(/[^\d]/g, '').slice(0, 4);
    }
    
    setFormData({ ...formData, [name]: value });
    
    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true });
    }
    
    const errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
    
    if (name === 'cvv') {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
    setEnteredOtp(value);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(field => {
      const errorMessage = validateField(field, formData[field]);
      newErrors[field] = errorMessage;
      if (errorMessage) {
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setFormTouched({
      cardNumber: true,
      expiry: true,
      cvv: true,
      email: true
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const formElement = document.getElementById('payment-form');
      formElement.style.animation = 'shake 0.5s';
      setTimeout(() => {
        formElement.style.animation = '';
      }, 500);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email: formData.email });
      console.log('OTP Response:', response.data);
      setOtp(response.data.otp);
      setOtpSent(true);
      showNotification('OTP sent to your email!', 'success');
    } catch (error) {
      console.error('OTP error:', error);
      showNotification('Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    console.log('Stored OTP:', otp);
    console.log('Entered OTP:', enteredOtp);
    
    if (!enteredOtp) {
      showNotification('Please enter the OTP sent to your email', 'error');
      return;
    }
    
    setIsLoading(true);
    
    if (otp === enteredOtp) {
      try {
        await axios.post('http://localhost:5000/api/transactions', {
          bookId: book._id,
          email: formData.email,
          amount: book.price,
        });
        console.log('Transaction recorded, navigating to success');
        showNotification('Payment successful!', 'success');
        setTimeout(() => {
          navigate('/success');
        }, 1500);
      } catch (error) {
        console.error('Transaction error:', error);
        showNotification('Failed to process payment. Please try again.', 'error');
        setIsLoading(false);
      }
    } else {
      showNotification('Invalid OTP. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    const notificationEl = document.createElement('div');
    notificationEl.style.position = 'fixed';
    notificationEl.style.bottom = '20px';
    notificationEl.style.right = '20px';
    notificationEl.style.padding = '15px 25px';
    notificationEl.style.borderRadius = '8px';
    notificationEl.style.color = 'white';
    notificationEl.style.fontWeight = '500';
    notificationEl.style.zIndex = '1000';
    notificationEl.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notificationEl.style.animation = 'fadeIn 0.3s ease-out forwards';
    
    if (type === 'success') {
      notificationEl.style.backgroundColor = '#38A169';
    } else {
      notificationEl.style.backgroundColor = '#E53E3E';
    }
    
    notificationEl.textContent = message;
    document.body.appendChild(notificationEl);
    
    setTimeout(() => {
      notificationEl.style.opacity = '0';
      notificationEl.style.transform = 'translateY(20px)';
      notificationEl.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => {
        document.body.removeChild(notificationEl);
      }, 300);
    }, 3000);
  };

  const getCardLogo = () => {
    switch (cardType) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 MasterCard';
      case 'amex':
        return '💳 American Express';
      case 'discover':
        return '💳 Discover';
      default:
        return '💳';
    }
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif",
      opacity: pageLoaded ? 1 : 0,
      transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    },
    gradientBackground: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      opacity: 0.1,
      zIndex: -1,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      animation: 'fadeIn 0.5s ease-out',
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #f0f0f0',
      background: 'linear-gradient(90deg, #4b6cb7, #182848)',
      color: 'white',
    },
    cardTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      margin: '0',
      textAlign: 'center',
    },
    paymentIconsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem',
      flexWrap: 'wrap',
    },
    paymentIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '6px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    paymentIconHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    paymentIconImage: {
      width: '40px',
      height: 'auto',
    },
    cardBody: {
      padding: '2rem',
    },
    bookDetails: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      animation: 'slideIn 0.5s ease-out',
    },
    bookImage: {
      width: '100%',
      maxWidth: '120px',
      height: 'auto',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    bookInfo: {
      marginLeft: '1.5rem',
      flex: 1,
    },
    bookTitle: {
      fontSize: '1.4rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#2d3748',
    },
    bookPrice: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#38a169',
    },
    form: {
      marginTop: '1rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
      position: 'relative',
    },
    inputLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#4a5568',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    inputFocus: {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
    },
    inputError: {
      borderColor: '#fc8181',
      boxShadow: '0 0 0 3px rgba(252, 129, 129, 0.2)',
    },
    errorText: {
      color: '#e53e3e',
      fontSize: '0.8rem',
      marginTop: '0.5rem',
      animation: 'fadeIn 0.3s ease-out',
    },
    cardTypeIcon: {
      position: 'absolute',
      right: '1rem',
      top: '2.3rem',
      fontSize: '1.2rem',
    },
    button: {
      display: 'inline-block',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#4299e1',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
      width: '100%',
    },
    buttonHover: {
      backgroundColor: '#3182ce',
      transform: 'translateY(-2px)',
      boxShadow: '0 7px 14px rgba(66, 153, 225, 0.3)',
    },
    buttonDisabled: {
      backgroundColor: '#a0aec0',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    otpContainer: {
      marginTop: '1.5rem',
      padding: '1.5rem',
      backgroundColor: '#f7fafc',
      borderRadius: '12px',
      animation: 'fadeIn 0.5s ease-out',
    },
    otpTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#2d3748',
      textAlign: 'center',
    },
    otpInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1.2rem',
      textAlign: 'center',
      letterSpacing: '0.5rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease',
      outline: 'none',
      marginBottom: '1rem',
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    creditCard: {
      perspective: '1000px',
      marginBottom: '2rem',
    },
    creditCardInner: {
      position: 'relative',
      width: '100%',
      height: '200px',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d',
      animation: isFlipped ? 'rotate 0.6s forwards' : 'rotateBack 0.6s forwards',
    },
    creditCardFront: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      backgroundColor: '#1a365d',
      backgroundImage: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      color: 'white',
    },
    creditCardBack: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      backgroundColor: '#1a365d',
      backgroundImage: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      color: 'white',
      transform: 'rotateY(180deg)',
    },
    creditCardLogo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '30px',
    },
    creditCardNumber: {
      fontSize: '1.4rem',
      letterSpacing: '2px',
      marginBottom: '20px',
    },
    creditCardInfo: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    creditCardHolder: {
      fontSize: '0.9rem',
      opacity: 0.8,
    },
    creditCardExpiry: {
      fontSize: '0.9rem',
      opacity: 0.8,
    },
    creditCardStrip: {
      height: '40px',
      backgroundColor: '#2d3748',
      margin: '20px 0',
    },
    creditCardCvv: {
      backgroundColor: 'white',
      color: 'black',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '0.9rem',
      textAlign: 'right',
      marginTop: '10px',
    },
    creditCardCvvLabel: {
      fontSize: '0.8rem',
      color: 'white',
      marginBottom: '5px',
      textAlign: 'right',
    },
    responsiveContainer: {
      padding: '1rem',
    },
    responsiveBookDetails: {
      flexDirection: 'column',
      textAlign: 'center',
    },
    responsiveBookInfo: {
      marginLeft: 0,
      marginTop: '1rem',
    },
  };

  const isMobile = window.innerWidth <= 768;

  if (!book) return null;

  return (
    <div style={isMobile ? {...styles.container, ...styles.responsiveContainer} : styles.container}>
      <div style={styles.gradientBackground}></div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Secure Payment</h3>
          <div style={styles.paymentIconsContainer}>
            <div 
              style={styles.paymentIcon}
              onMouseEnter={(e) => e.currentTarget.style.transform = styles.paymentIconHover.transform}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFnGOEHtcSLfoHPNHYQG_-ULsnOj-AVveJOg&s" 
                alt="" 
                style={styles.paymentIconImage}
              />
            </div>
            <div 
              style={styles.paymentIcon}
              onMouseEnter={(e) => e.currentTarget.style.transform = styles.paymentIconHover.transform}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="https://img.icons8.com/color/512/visa.png" 
                alt="" 
                style={styles.paymentIconImage}
              />
            </div>
            <div 
              style={styles.paymentIcon}
              onMouseEnter={(e) => e.currentTarget.style.transform = styles.paymentIconHover.transform}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="https://cdn4.iconfinder.com/data/icons/payment-method/160/payment_method_master_card-512.png" 
                alt="" 
                style={styles.paymentIconImage}
              />
            </div>
            <div 
              style={styles.paymentIcon}
              onMouseEnter={(e) => e.currentTarget.style.transform = styles.paymentIconHover.transform}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="https://cdn2.iconfinder.com/data/icons/credit-cards-6/156/american_express-512.png" 
                alt="" 
                style={styles.paymentIconImage}
              />
            </div>
            <div 
              style={styles.paymentIcon}
              onMouseEnter={(e) => e.currentTarget.style.transform = styles.paymentIconHover.transform}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="https://cdn3.iconfinder.com/data/icons/payment-method/480/jcb_card_payment-512.png" 
                alt="" 
                style={styles.paymentIconImage}
              />
            </div>
          </div>
        </div>
        
        <div style={styles.cardBody}>
          <div style={isMobile ? {...styles.bookDetails, ...styles.responsiveBookDetails} : styles.bookDetails}>
            <img 
              src={book.coverImage || "/placeholder.svg"} 
              alt={book.name} 
              style={styles.bookImage} 
            />
            <div style={isMobile ? {...styles.bookInfo, ...styles.responsiveBookInfo} : styles.bookInfo}>
              <h4 style={styles.bookTitle}>{book.name}</h4>
              <p style={styles.bookPrice}>${book.price.toFixed(2)}</p>
            </div>
          </div>
          
          {!otpSent ? (
            <>
              <div style={styles.creditCard}>
                <div style={styles.creditCardInner}>
                  <div style={styles.creditCardFront}>
                    <div style={styles.creditCardLogo}>{getCardLogo()}</div>
                    <div style={styles.creditCardNumber}>
                      {formData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div style={styles.creditCardInfo}>
                      <div style={styles.creditCardHolder}>
                        <div style={{fontSize: '0.7rem', marginBottom: '5px'}}>CARD HOLDER</div>
                        {formData.email ? formData.email.split('@')[0].toUpperCase() : 'YOUR NAME'}
                      </div>
                      <div style={styles.creditCardExpiry}>
                        <div style={{fontSize: '0.7rem', marginBottom: '5px'}}>EXPIRES</div>
                        {formData.expiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                  <div style={styles.creditCardBack}>
                    <div style={styles.creditCardStrip}></div>
                    <div style={styles.creditCardCvvLabel}>CVV</div>
 ABOVE CODE IS TRUNCATED FOR BREVITY - FULL CODE CONTINUES BELOW IN THE RETURN STATEMENT

                    <div style={styles.creditCardCvv}>
                      {formData.cvv || '•••'}
                    </div>
                  </div>
                </div>
              </div>
              
              <form id="payment-form" style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(formTouched.cardNumber && errors.cardNumber ? styles.inputError : {}),
                    }}
                    maxLength="19"
                  />
                  {cardType && <div style={styles.cardTypeIcon}>{getCardLogo()}</div>}
                  {formTouched.cardNumber && errors.cardNumber && (
                    <div style={styles.errorText}>{errors.cardNumber}</div>
                  )}
                </div>
                
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.inputLabel}>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(formTouched.expiry && errors.expiry ? styles.inputError : {}),
                      }}
                      maxLength="5"
                    />
                    {formTouched.expiry && errors.expiry && (
                      <div style={styles.errorText}>{errors.expiry}</div>
                    )}
                  </div>
                  
                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.inputLabel}>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(formTouched.cvv && errors.cvv ? styles.inputError : {}),
                      }}
                      maxLength="4"
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                    />
                    {formTouched.cvv && errors.cvv && (
                      <div style={styles.errorText}>{errors.cvv}</div>
                    )}
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.inputLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(formTouched.email && errors.email ? styles.inputError : {}),
                    }}
                  />
                  {formTouched.email && errors.email && (
                    <div style={styles.errorText}>{errors.email}</div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Verification'}
                </button>
              </form>
            </>
          ) : (
            <div style={styles.otpContainer}>
              <h4 style={styles.otpTitle}>Enter the OTP sent to your email</h4>
              <input
                type="text"
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={handleOtpChange}
                style={styles.otpInput}
                maxLength="6"
              />
              <button 
                type="button" 
                style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Processing Payment...' : 'Complete Payment'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}></div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;