"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

const PaymentForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const book = location.state?.book

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    email: "",
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [enteredOtp, setEnteredOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cardType, setCardType] = useState("")
  const [formTouched, setFormTouched] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false,
    email: false,
  })
  const [isFlipped, setIsFlipped] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [animationElements, setAnimationElements] = useState([])

  // Add keyframes for animations
  useEffect(() => {
    const styleEl = document.createElement("style")
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
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes floatReverse {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(-5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes spinSlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes checkmark {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes dataFlow {
        0% { transform: translateY(0) scale(0.5); opacity: 0.7; }
        100% { transform: translateY(300px) scale(0.1); opacity: 0; }
      }
      @keyframes lockBounce {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      @keyframes coinSpin {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
      @keyframes fadeInOut {
        0% { opacity: 0; }
        50% { opacity: 0.7; }
        100% { opacity: 0; }
      }
      @keyframes moveLeftRight {
        0% { transform: translateX(0); }
        50% { transform: translateX(20px); }
        100% { transform: translateX(0); }
      }
      @keyframes moveUpDown {
        0% { transform: translateY(0); }
        50% { transform: translateY(20px); }
        100% { transform: translateY(0); }
      }
      @keyframes scaleUpDown {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      @keyframes rotateClockwise {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes rotateCounterClockwise {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
    `
    document.head.appendChild(styleEl)

    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // Generate random animation elements
  useEffect(() => {
    // Create background animation elements
    const generateAnimationElements = () => {
      const elements = []

      // Credit card icons
      elements.push({
        type: "card",
        position: { top: "15%", left: "5%" },
        size: { width: "60px", height: "40px" },
        animation: "float 8s ease-in-out infinite",
        image: "https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-1024.png",
        alt: "Floating Visa",
      })

      elements.push({
        type: "card",
        position: { top: "25%", right: "8%" },
        size: { width: "60px", height: "40px" },
        animation: "floatReverse 10s ease-in-out infinite 1s",
        image: "https://cdn4.iconfinder.com/data/icons/payment-method/160/payment_method_master_card-512.png",
        alt: "Floating Mastercard",
      })

      // Secure lock animation
      elements.push({
        type: "lock",
        position: { bottom: "20%", left: "10%" },
        size: { width: "40px", height: "40px" },
        animation: "lockBounce 4s ease-in-out infinite",
      })

      // Checkmark animation
      elements.push({
        type: "checkmark",
        position: { top: "40%", right: "15%" },
        size: { width: "40px", height: "40px" },
        animation: "checkmark 3s ease infinite",
      })

      // Data flow animations
      for (let i = 0; i < 8; i++) {
        elements.push({
          type: "dataFlow",
          position: {
            top: `${Math.random() * 20}%`,
            left: `${Math.random() * 80}%`,
          },
          size: { width: "8px", height: "2px" },
          animation: `dataFlow ${5 + Math.random() * 5}s linear infinite ${Math.random() * 5}s`,
        })
      }

      // Coin animation
      elements.push({
        type: "coin",
        position: { bottom: "15%", right: "10%" },
        size: { width: "30px", height: "30px" },
        animation: "coinSpin 4s linear infinite",
      })

      // Success pulse animations
      elements.push({
        type: "pulse",
        position: { top: "60%", left: "20%" },
        size: { width: "50px", height: "50px" },
        animation: "fadeInOut 4s ease-in-out infinite",
      })

      elements.push({
        type: "pulse",
        position: { top: "60%", left: "20%" },
        size: { width: "30px", height: "30px" },
        animation: "fadeInOut 4s ease-in-out infinite 0.5s",
      })

      // Additional payment symbols
      elements.push({
        type: "symbol",
        position: { top: "70%", right: "20%" },
        content: "$",
        size: { width: "30px", height: "30px" },
        animation: "moveUpDown 6s ease-in-out infinite",
      })

      elements.push({
        type: "symbol",
        position: { top: "30%", left: "20%" },
        content: "€",
        size: { width: "30px", height: "30px" },
        animation: "moveLeftRight 7s ease-in-out infinite",
      })

      // Additional currency symbols
      // British Pound
      elements.push({
        type: "symbol",
        position: { top: "45%", right: "30%" },
        content: "£",
        size: { width: "30px", height: "30px" },
        animation: "floatReverse 9s ease-in-out infinite 0.5s",
        zIndex: -1,
      })

      // Japanese Yen
      elements.push({
        type: "symbol",
        position: { top: "20%", left: "30%" },
        content: "¥",
        size: { width: "30px", height: "30px" },
        animation: "float 7s ease-in-out infinite 1s",
        zIndex: -1,
      })

      // Indian Rupee
      elements.push({
        type: "symbol",
        position: { bottom: "40%", left: "25%" },
        content: "₹",
        size: { width: "30px", height: "30px" },
        animation: "moveLeftRight 8s ease-in-out infinite 1.5s",
        zIndex: -1,
      })

      // Bitcoin
      elements.push({
        type: "symbol",
        position: { top: "55%", right: "5%" },
        content: "₿",
        size: { width: "30px", height: "30px" },
        animation: "pulse 6s ease-in-out infinite 2s",
        zIndex: -1,
      })

      // Russian Ruble
      elements.push({
        type: "symbol",
        position: { bottom: "25%", right: "35%" },
        content: "₽",
        size: { width: "30px", height: "30px" },
        animation: "moveUpDown 9s ease-in-out infinite 0.7s",
        zIndex: -1,
      })

      // Korean Won
      elements.push({
        type: "symbol",
        position: { top: "35%", left: "40%" },
        content: "₩",
        size: { width: "30px", height: "30px" },
        animation: "floatReverse 8s ease-in-out infinite 1.2s",
        zIndex: -1,
      })

      // Secure transaction icon
      elements.push({
        type: "secureIcon",
        position: { bottom: "30%", right: "25%" },
        size: { width: "40px", height: "40px" },
        animation: "pulse 5s ease-in-out infinite",
      })

      return elements
    }

    setAnimationElements(generateAnimationElements())
  }, [])

  useEffect(() => {
    if (!book) {
      navigate("/")
      showNotification("No book selected. Please use voice input on the home page.", "error")
    } else {
      setTimeout(() => setPageLoaded(true), 100)
    }
  }, [book, navigate])

  useEffect(() => {
    const cardNumber = formData.cardNumber.replace(/\s/g, "")

    if (cardNumber.startsWith("4")) {
      setCardType("visa")
    } else if (/^5[1-5]/.test(cardNumber)) {
      setCardType("mastercard")
    } else if (/^3[47]/.test(cardNumber)) {
      setCardType("amex")
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      setCardType("discover")
    } else {
      setCardType("")
    }
  }, [formData.cardNumber])

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? "/" + v.slice(2, 4) : "")
    }

    return v
  }

  const validateField = (name, value) => {
    let errorMessage = ""

    switch (name) {
      case "cardNumber":
        const cardNumberClean = value.replace(/\s/g, "")
        if (!cardNumberClean) {
          errorMessage = "Card number is required"
        } else if (!/^\d+$/.test(cardNumberClean)) {
          errorMessage = "Card number must contain only digits"
        } else if (cardNumberClean.length < 15 || cardNumberClean.length > 16) {
          errorMessage = "Card number must be 15-16 digits"
        }
        break

      case "expiry":
        if (!value) {
          errorMessage = "Expiry date is required"
        } else if (!/^\d{2}\/\d{2}$/.test(value)) {
          errorMessage = "Expiry date must be in MM/YY format"
        } else {
          const [month, year] = value.split("/")
          const currentYear = new Date().getFullYear() % 100
          const currentMonth = new Date().getMonth() + 1

          if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
            errorMessage = "Month must be between 01-12"
          } else if (
            Number.parseInt(year) < currentYear ||
            (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
          ) {
            errorMessage = "Card has expired"
          }
        }
        break

      case "cvv":
        if (!value) {
          errorMessage = "CVV is required"
        } else if (!/^\d{3,4}$/.test(value)) {
          errorMessage = "CVV must be 3-4 digits"
        }
        break

      case "email":
        if (!value) {
          errorMessage = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Please enter a valid email address"
        }
        break

      default:
        break
    }

    return errorMessage
  }

  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === "cardNumber") {
      value = formatCardNumber(value)
    } else if (name === "expiry") {
      value = formatExpiry(value)
    } else if (name === "cvv") {
      value = value.replace(/[^\d]/g, "").slice(0, 4)
    }

    setFormData({ ...formData, [name]: value })

    if (!formTouched[name]) {
      setFormTouched({ ...formTouched, [name]: true })
    }

    const errorMessage = validateField(name, value)
    setErrors({ ...errors, [name]: errorMessage })

    if (name === "cvv") {
      setIsFlipped(true)
    } else {
      setIsFlipped(false)
    }
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6)
    setEnteredOtp(value)
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach((field) => {
      const errorMessage = validateField(field, formData[field])
      newErrors[field] = errorMessage
      if (errorMessage) {
        isValid = false
      }
    })

    setErrors(newErrors)
    setFormTouched({
      cardNumber: true,
      expiry: true,
      cvv: true,
      email: true,
    })

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      const formElement = document.getElementById("payment-form")
      formElement.style.animation = "shake 0.5s"
      setTimeout(() => {
        formElement.style.animation = ""
      }, 500)
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", { email: formData.email })
      console.log("OTP Response:", response.data)
      setOtp(response.data.otp)
      setOtpSent(true)
      showNotification("OTP sent to your email!", "success")
    } catch (error) {
      console.error("OTP error:", error)
      showNotification("Failed to send OTP. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    console.log("Stored OTP:", otp)
    console.log("Entered OTP:", enteredOtp)

    if (!enteredOtp) {
      showNotification("Please enter the OTP sent to your email", "error")
      return
    }

    setIsLoading(true)

    if (otp === enteredOtp) {
      try {
        await axios.post("http://localhost:5000/api/transactions", {
          bookId: book._id,
          email: formData.email,
          amount: book.price,
        })
        console.log("Transaction recorded, navigating to success")
        showNotification("Payment successful!", "success")

        // Add success animation
        const successEl = document.createElement("div")
        successEl.style.position = "fixed"
        successEl.style.top = "50%"
        successEl.style.left = "50%"
        successEl.style.transform = "translate(-50%, -50%)"
        successEl.style.width = "100px"
        successEl.style.height = "100px"
        successEl.style.borderRadius = "50%"
        successEl.style.backgroundColor = "rgba(56, 161, 105, 0.2)"
        successEl.style.display = "flex"
        successEl.style.justifyContent = "center"
        successEl.style.alignItems = "center"
        successEl.style.zIndex = "2000"
        successEl.style.animation = "pulse 1s ease-in-out infinite"

        const checkmark = document.createElement("div")
        checkmark.style.width = "50px"
        checkmark.style.height = "25px"
        checkmark.style.borderBottom = "5px solid rgba(56, 161, 105, 1)"
        checkmark.style.borderRight = "5px solid rgba(56, 161, 105, 1)"
        checkmark.style.transform = "rotate(45deg)"
        checkmark.style.animation = "checkmark 1s ease-out"

        successEl.appendChild(checkmark)
        document.body.appendChild(successEl)

        setTimeout(() => {
          navigate("/success")
        }, 1500)
      } catch (error) {
        console.error("Transaction error:", error)
        showNotification("Failed to process payment. Please try again.", "error")
        setIsLoading(false)
      }
    } else {
      showNotification("Invalid OTP. Please try again.", "error")
      setIsLoading(false)
    }
  }

  const showNotification = (message, type = "success") => {
    const notificationEl = document.createElement("div")
    notificationEl.style.position = "fixed"
    notificationEl.style.bottom = "20px"
    notificationEl.style.right = "20px"
    notificationEl.style.padding = "15px 25px"
    notificationEl.style.borderRadius = "8px"
    notificationEl.style.color = "white"
    notificationEl.style.fontWeight = "500"
    notificationEl.style.zIndex = "1000"
    notificationEl.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)"
    notificationEl.style.animation = "fadeIn 0.3s ease-out forwards"

    if (type === "success") {
      notificationEl.style.backgroundColor = "#38A169"
    } else {
      notificationEl.style.backgroundColor = "#E53E3E"
    }

    notificationEl.textContent = message
    document.body.appendChild(notificationEl)

    setTimeout(() => {
      notificationEl.style.opacity = "0"
      notificationEl.style.transform = "translateY(20px)"
      notificationEl.style.transition = "opacity 0.3s, transform 0.3s"
      setTimeout(() => {
        document.body.removeChild(notificationEl)
      }, 300)
    }, 3000)
  }

  const getCardLogo = () => {
    switch (cardType) {
      case "visa":
        return (
          <img
            src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-1024.png"
            alt="Visa"
            style={{ width: "40px", height: "auto" }}
          />
        )
      case "mastercard":
        return (
          <img
            src="https://cdn4.iconfinder.com/data/icons/payment-method/160/payment_method_master_card-512.png"
            alt="Mastercard"
            style={{ width: "40px", height: "auto" }}
          />
        )
      case "amex":
        return (
          <img
            src="https://cdn2.iconfinder.com/data/icons/credit-cards-6/156/american_express-512.png"
            alt="American Express"
            style={{ width: "40px", height: "auto" }}
          />
        )
      case "discover":
        return (
          <img
            src="https://cdn3.iconfinder.com/data/icons/payment-method/480/jcb_card_payment-512.png"
            alt="Discover"
            style={{ width: "40px", height: "auto" }}
          />
        )
      default:
        return <span>💳</span>
    }
  }

  // Render animation elements
  const renderAnimationElements = () => {
    return animationElements.map((element, index) => {
      switch (element.type) {
        case "card":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                animation: element.animation,
                zIndex: -1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={element.image || "/placeholder.svg"}
                alt={element.alt}
                style={{ width: "40px", height: "auto" }}
              />
            </div>
          )

        case "lock":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "50%",
                backgroundColor: "rgba(35, 166, 213, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animation: element.animation,
                zIndex: -1,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255, 255, 255, 0.8)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </div>
          )

        case "checkmark":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "50%",
                backgroundColor: "rgba(56, 161, 105, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: -1,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  position: "relative",
                  animation: element.animation,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -40%) rotate(45deg)",
                    width: "10px",
                    height: "5px",
                    borderBottom: "2px solid rgba(255, 255, 255, 0.8)",
                    borderRight: "2px solid rgba(255, 255, 255, 0.8)",
                  }}
                ></div>
              </div>
            </div>
          )

        case "dataFlow":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "absolute",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                backgroundColor: "rgba(66, 153, 225, 0.3)",
                animation: element.animation,
                zIndex: -1,
              }}
            ></div>
          )

        case "coin":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 193, 7, 0.3)",
                border: "2px solid rgba(255, 193, 7, 0.5)",
                animation: element.animation,
                zIndex: -1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                $
              </div>
            </div>
          )

        case "pulse":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "2px solid rgba(56, 161, 105, 0.3)",
                animation: element.animation,
                zIndex: -1,
              }}
            ></div>
          )

        case "symbol":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "50%",
                backgroundColor: "rgba(66, 153, 225, 0.3)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animation: element.animation,
                zIndex: -1,
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "bold",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              {element.content}
            </div>
          )

        case "secureIcon":
          return (
            <div
              key={`anim-${index}`}
              style={{
                position: "fixed",
                ...element.position,
                width: element.size.width,
                height: element.size.height,
                borderRadius: "50%",
                backgroundColor: "rgba(66, 153, 225, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                animation: element.animation,
                zIndex: -1,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "16px",
                    height: "10px",
                    borderRadius: "3px",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                  }}
                ></div>
              </div>
            </div>
          )

        default:
          return null
      }
    })
  }

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
      opacity: pageLoaded ? 1 : 0,
      transform: pageLoaded ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      position: "relative",
      zIndex: 1,
    },
    gradientBackground: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
      backgroundSize: "400% 400%",
      animation: "gradient 15s ease infinite",
      opacity: 0.35, // Increased from 0.25
      zIndex: -1,
    },
    decorativePattern: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.3) 2%, transparent 0%)",
      backgroundSize: "100px 100px",
      zIndex: -1,
      pointerEvents: "none",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      overflow: "hidden",
      animation: "fadeIn 0.5s ease-out",
      position: "relative",
      zIndex: 2,
    },
    cardHeader: {
      padding: "1.5rem",
      borderBottom: "1px solid #f0f0f0",
      background: "linear-gradient(90deg, #4b6cb7, #182848)",
      color: "white",
    },
    cardTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      margin: "0",
      textAlign: "center",
    },
    paymentIconsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "1rem",
      flexWrap: "wrap",
    },
    paymentIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "60px",
      height: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "6px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "default",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    paymentIconHover: {
      transform: "scale(1.05)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    paymentIconImage: {
      width: "40px",
      height: "auto",
      filter: "none",
    },
    cardBody: {
      padding: "2rem",
    },
    bookDetails: {
      display: "flex",
      alignItems: "center",
      marginBottom: "2rem",
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      animation: "slideIn 0.5s ease-out",
    },
    bookImage: {
      width: "100%",
      maxWidth: "120px",
      height: "auto",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    bookInfo: {
      marginLeft: "1.5rem",
      flex: 1,
    },
    bookTitle: {
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#2d3748",
    },
    bookPrice: {
      fontSize: "1.2rem",
      fontWeight: "700",
      color: "#38a169",
    },
    form: {
      marginTop: "1rem",
    },
    formGroup: {
      marginBottom: "1.5rem",
      position: "relative",
    },
    inputLabel: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#4a5568",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      borderRadius: "8px",
      border: "2px solid #e2e8f0",
      transition: "all 0.3s ease",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#4299e1",
      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.2)",
    },
    inputError: {
      borderColor: "#fc8181",
      boxShadow: "0 0 0 3px rgba(252, 129, 129, 0.2)",
    },
    errorText: {
      color: "#e53e3e",
      fontSize: "0.8rem",
      marginTop: "0.5rem",
      animation: "fadeIn 0.3s ease-out",
    },
    cardTypeIcon: {
      position: "absolute",
      right: "1rem",
      top: "2.3rem",
      fontSize: "1.2rem",
    },
    button: {
      display: "inline-block",
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "600",
      color: "white",
      backgroundColor: "#4299e1",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 6px rgba(66, 153, 225, 0.2)",
      width: "100%",
    },
    buttonHover: {
      backgroundColor: "#3182ce",
      transform: "translateY(-2px)",
      boxShadow: "0 7px 14px rgba(66, 153, 225, 0.3)",
    },
    buttonDisabled: {
      backgroundColor: "#a0aec0",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    otpContainer: {
      marginTop: "1.5rem",
      padding: "1.5rem",
      backgroundColor: "#f7fafc",
      borderRadius: "12px",
      animation: "fadeIn 0.5s ease-out",
    },
    otpTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#2d3748",
      textAlign: "center",
    },
    otpInput: {
      width: "100%",
      padding: "0.75rem 1rem",
      fontSize: "1.2rem",
      textAlign: "center",
      letterSpacing: "0.5rem",
      borderRadius: "8px",
      border: "2px solid #e2e8f0",
      transition: "all 0.3s ease",
      outline: "none",
      marginBottom: "1rem",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #3498db",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    creditCard: {
      perspective: "1000px",
      marginBottom: "2rem",
    },
    creditCardInner: {
      position: "relative",
      width: "100%",
      height: "200px",
      transition: "transform 0.6s",
      transformStyle: "preserve-3d",
      animation: isFlipped ? "rotate 0.6s forwards" : "rotateBack 0.6s forwards",
    },
    creditCardFront: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      backgroundColor: "#1a365d",
      backgroundImage: "linear-gradient(135deg, #1a365d 0%, #3182ce 100%)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      color: "white",
    },
    creditCardBack: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      backgroundColor: "#1a365d",
      backgroundImage: "linear-gradient(135deg, #1a365d 0%, #3182ce 100%)",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      color: "white",
      transform: "rotateY(180deg)",
    },
    creditCardLogo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "30px",
    },
    creditCardNumber: {
      fontSize: "1.4rem",
      letterSpacing: "2px",
      marginBottom: "20px",
    },
    creditCardInfo: {
      display: "flex",
      justifyContent: "space-between",
    },
    creditCardHolder: {
      fontSize: "0.9rem",
      opacity: 0.8,
    },
    creditCardExpiry: {
      fontSize: "0.9rem",
      opacity: 0.8,
    },
    creditCardStrip: {
      height: "40px",
      backgroundColor: "#2d3748",
      margin: "20px 0",
    },
    creditCardCvv: {
      backgroundColor: "white",
      color: "black",
      padding: "10px",
      borderRadius: "5px",
      fontSize: "0.9rem",
      textAlign: "right",
      marginTop: "10px",
    },
    creditCardCvvLabel: {
      fontSize: "0.8rem",
      color: "white",
      marginBottom: "5px",
      textAlign: "right",
    },
    responsiveContainer: {
      padding: "1rem",
    },
    responsiveBookDetails: {
      flexDirection: "column",
      textAlign: "center",
    },
    responsiveBookInfo: {
      marginLeft: 0,
      marginTop: "1rem",
    },
    // Animation container
    animationContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      pointerEvents: "none",
      overflow: "hidden",
    },
  }

  const isMobile = window.innerWidth <= 768

  if (!book) return null

  return (
    <div style={isMobile ? { ...styles.container, ...styles.responsiveContainer } : styles.container}>
      <div style={styles.gradientBackground}></div>
      <div style={styles.decorativePattern}></div>

      {/* Animation container */}
      <div style={styles.animationContainer}>{renderAnimationElements()}</div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Secure Payment</h3>
          {/* Added Payment Icons Section */}
          <div style={styles.paymentIconsContainer}>
            <div
              style={styles.paymentIcon}
              onMouseEnter={(e) => (e.currentTarget.style.transform = styles.paymentIconHover.transform)}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                alt="PayPal"
                style={{ ...styles.paymentIconImage, width: "45px" }}
              />
            </div>
            <div
              style={styles.paymentIcon}
              onMouseEnter={(e) => (e.currentTarget.style.transform = styles.paymentIconHover.transform)}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-1024.png"
                alt="Visa"
                style={styles.paymentIconImage}
              />
            </div>
            <div
              style={styles.paymentIcon}
              onMouseEnter={(e) => (e.currentTarget.style.transform = styles.paymentIconHover.transform)}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/payment-method/160/payment_method_master_card-512.png"
                alt="Mastercard"
                style={styles.paymentIconImage}
              />
            </div>
            <div
              style={styles.paymentIcon}
              onMouseEnter={(e) => (e.currentTarget.style.transform = styles.paymentIconHover.transform)}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="https://cdn2.iconfinder.com/data/icons/credit-cards-6/156/american_express-512.png"
                alt="American Express"
                style={styles.paymentIconImage}
              />
            </div>
            <div
              style={styles.paymentIcon}
              onMouseEnter={(e) => (e.currentTarget.style.transform = styles.paymentIconHover.transform)}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="https://cdn3.iconfinder.com/data/icons/payment-method/480/jcb_card_payment-512.png"
                alt="JCB"
                style={styles.paymentIconImage}
              />
            </div>
          </div>
        </div>

        <div style={styles.cardBody}>
          <div style={isMobile ? { ...styles.bookDetails, ...styles.responsiveBookDetails } : styles.bookDetails}>
            <img src={book.coverImage || "/placeholder.svg"} alt={book.name} style={styles.bookImage} />
            <div style={isMobile ? { ...styles.bookInfo, ...styles.responsiveBookInfo } : styles.bookInfo}>
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
                    <div style={styles.creditCardNumber}>{formData.cardNumber || "•••• •••• •••• ••••"}</div>
                    <div style={styles.creditCardInfo}>
                      <div style={styles.creditCardHolder}>
                        <div style={{ fontSize: "0.7rem", marginBottom: "5px" }}>CARD HOLDER</div>
                        {formData.email ? formData.email.split("@")[0].toUpperCase() : "YOUR NAME"}
                      </div>
                      <div style={styles.creditCardExpiry}>
                        <div style={{ fontSize: "0.7rem", marginBottom: "5px" }}>EXPIRES</div>
                        {formData.expiry || "MM/YY"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.creditCardBack}>
                    <div style={styles.creditCardStrip}></div>
                    <div style={styles.creditCardCvvLabel}>CVV</div>
                    <div style={styles.creditCardCvv}>{formData.cvv || "•••"}</div>
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

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
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
                    {formTouched.expiry && errors.expiry && <div style={styles.errorText}>{errors.expiry}</div>}
                  </div>

                  <div style={{ ...styles.formGroup, flex: 1 }}>
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
                    {formTouched.cvv && errors.cvv && <div style={styles.errorText}>{errors.cvv}</div>}
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
                  {formTouched.email && errors.email && <div style={styles.errorText}>{errors.email}</div>}
                </div>

                <button
                  type="submit"
                  style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                  disabled={isLoading}
                  onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = styles.buttonHover.transform)}
                  onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {isLoading ? "Processing..." : "Proceed to Verification"}
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
                style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                onClick={handleConfirm}
                disabled={isLoading}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = styles.buttonHover.transform)}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(0)")}
              >
                {isLoading ? "Processing Payment..." : "Complete Payment"}
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
  )
}

export default PaymentForm

