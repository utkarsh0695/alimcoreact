import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Input } from 'reactstrap';
import { IoMdRefreshCircle } from 'react-icons/io';

const Captcha = forwardRef(({ setCaptchaValid, setCaptchaError }, ref,size) => {
  const [captcha, setCaptcha] = useState('');
  const [input, setInput] = useState('');
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetCaptcha() {
      setInput('');
      setCaptchaValid(false);
      generateCaptcha();
    },
    getCaptchaValue() {
      return captcha;
    },
  }));

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(captcha);
  };

  const renderCaptcha = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random()})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random()})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';
    ctx.fillText(captcha, 10, 25);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    renderCaptcha();
  }, [captcha]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value === '') {
      setCaptchaValid(false);
      setCaptchaError('Captcha is required');
    } else if (value === captcha) {
      setCaptchaValid(true);
      setCaptchaError('');
    } else {
      setCaptchaValid(false);
      setCaptchaError('Invalid Captcha');
    }
  };

  return (
    <div className="position-relative">
      <div className="d-flex justify-content-center flex-column align-items-center mb-2">
       <div>
       <canvas
          ref={canvasRef}
          width="140"
          height="40"
          style={{
            border: '1px solid #d7d7d7',
            marginRight: '5px',
            borderRadius: '8px',
            fontSize: '20px',
            backgroundColor: '#f3f3f3',
          }}
        />
        <IoMdRefreshCircle
          style={{ fontSize: '20px', color: '#7366ff',marginBottom: "10px",cursor:"pointer" }}
          onClick={generateCaptcha}
         
        />
       </div>
          <Input
          style={{width:size||'100%'}}
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter CAPTCHA"
      />
      </div>
    
    </div>
  );
});

export default Captcha;
