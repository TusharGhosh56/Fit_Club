import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../css/PaymentPage.css';

const PaymentPage = ({ plan, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();
    alert('This is a demo payment page. No actual payment will be processed.');
  };

  const formatCardNumber = (value) => {
    const val = value.replace(/\s/g, '');
    const groups = val.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiryDate = (value) => {
    const val = value.replace(/\D/g, '');
    if (val.length >= 2) {
      return val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    return val;
  };

  return (
    <motion.div 
      className="payment-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="payment-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button className="close-button" onClick={onClose} title="Close">×</button>
        <div className="payment-header">
          <h2>Complete Payment</h2>
          <div className="amount-display">
            <span>Amount to Pay:</span>
            <span className="price">{plan === 'basic' ? '₹1,200' : '₹1,500'}</span>
          </div>
        </div>

        <div className="payment-methods">
          <div className="method-selector">
            <button 
              className={`method-button ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <i className="fas fa-credit-card"></i>
              Card
            </button>
            <button 
              className={`method-button ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <i className="fas fa-mobile-alt"></i>
              UPI
            </button>
            <button 
              className={`method-button ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              <i className="fas fa-university"></i>
              Net Banking
            </button>
            <button 
              className={`method-button ${paymentMethod === 'wallet' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <i className="fas fa-wallet"></i>
              Wallet
            </button>
          </div>

          <form onSubmit={handlePayment} className="payment-form">
            {paymentMethod === 'card' && (
              <div className="card-inputs">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength="19"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="upi-inputs">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="username@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div className="upi-apps">
                  <button type="button" className="upi-app-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="Google Pay" />
                    GPay
                  </button>
                  <button type="button" className="upi-app-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" />
                    Paytm
                  </button>
                  <button type="button" className="upi-app-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" alt="PhonePe" />
                    PhonePe
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="netbanking-options">
                <div className="popular-banks">
                  <h4>Popular Banks</h4>
                  <div className="bank-grid">
                    {['HDFC', 'ICICI', 'SBI', 'Axis'].map(bank => (
                      <button key={bank} type="button" className="bank-button">
                        {bank} Bank
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="wallet-options">
                <div className="wallet-grid">
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'].map(wallet => (
                    <button key={wallet} type="button" className="wallet-button">
                      {wallet}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="pay-button">
              Pay {plan === 'basic' ? '₹1,200' : '₹1,500'}
            </button>
          </form>
        </div>

        <div className="payment-footer">
          <div className="secure-badge">
            <i className="fas fa-lock"></i>
            Payments are secure and encrypted
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentPage;
