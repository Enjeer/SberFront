import React, { useState, useEffect, useRef } from 'react';
import './chatComponent.css';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [containerHeight, setContainerHeight] = useState('100%');
  const [isLoading, setIsLoading] = useState(false);

  const [showKeywordPopup, setShowKeywordPopup] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const headerRef = useRef(null);

  const AI21_API_KEY = process.env.AI21_API_KEY;

  const buildSystemMessage = () => ({
    role: 'system',
    content: `
Ты — умный и дружелюбный помощник по имени СберЛис.

Если пользователь хочет оформить карту или интересуется банковскими картами, не пиши подробный список карт в ответе. Вместо этого ответь строго и только так: "[SHOW_CARDS]".

Если вопрос не про карты — отвечай обычным текстом, как обычно.

Примеры:
Пользователь: "Хочу оформить карту"
Ты: "[SHOW_CARDS]"
Пользователь: "Ultra Card (или любая из предложенных)"
Ты: "[SHOW_KEY_WORD]"

Если не знаешь ответа — аккуратно сообщи и предложи альтернативы.
`
  });

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setContainerHeight(`calc(100% - ${headerHeight}px)`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const handleSend = async () => {
    // Если сейчас открыт попап с вводом кодового слова — не отправляем основной input
    if (showKeywordPopup) return;

    if (!input.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { text: input, fromUser: true, time };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const systemMessage = buildSystemMessage();
      const requestBody = {
        model: "jamba-large-1.6-2025-03",
        messages: [
          systemMessage,
          { role: "user", content: input.trim() }
        ],
        temperature: 0.7,
        topP: 1,
        maxTokens: 200
      };

      const response = await fetch("https://api.ai21.com/studio/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AI21_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка запроса: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim() || '';

      if (text === '[SHOW_CARDS]') {
        const cards = [
          { title: 'СберКарта', subtitle: 'Бесплатное обслуживание, кэшбэк до 10%' },
          { title: 'Белкарт Премиум', subtitle: 'Срок действия: 5 лет, обслуживание: 20 BYN' },
          { title: 'Ultra Card 2.0', subtitle: 'Премиальные привилегии, расширенная страховка' }
        ];

        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, {
          text: 'Какую карту вы хотите оформить? Вот несколько популярных вариантов 👇🏻',
          fromUser: false,
          time: botTime,
          cards,
        }]);
      } else if (text === '[SHOW_KEY_WORD]') {
        // Показываем попап с вводом кодового слова
        setShowKeywordPopup(true);
      } else {
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { text, fromUser: false, time: botTime }]);
      }
    } catch (error) {
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { text: 'Ошибка соединения с сервером', fromUser: false, time: errorTime }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmKeyword = () => {
    if (!keywordInput.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Добавляем в чат сообщение пользователя с кодовым словом из попапа
    setMessages(prev => [...prev, { text: keywordInput.trim(), fromUser: true, time }]);

    setShowKeywordPopup(false);
    setShowHint(false);
    setKeywordInput('');

    // Можно автоматически отправить кодовое слово как новый запрос, если нужно:
    // setInput(keywordInput.trim());
    // handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      if (showKeywordPopup) {
        handleConfirmKeyword();
      } else {
        handleSend();
      }
    }
  };

  const getCardImage = (title) => {
    switch(title.toLowerCase()) {
      case 'ultra card 2.0':
      case 'ultracard 2.0':
        return '../assets/UltraCard 2_0.png';
      case 'белкарт премиум':
      case 'belkart премиум':
        return '../assets/BelcardPremium.png';
      case 'сберкарта':
      case 'sberкарта':
      case 'sbercard':
        return '../assets/SberCard.png';
      default:
        return '../assets/defaultCard.png';
    }
  };

  return (
    <div className="chat_component_container" style={{ height: containerHeight }}>
      <nav className="chat_nav" ref={headerRef}>
        <img src="../assets/Sber_Lis_Icon.png" alt="logo" />
        <span>СберЛис</span>
        <button></button>
      </nav>

      <div className="chat_messages">
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <div className={`chat_message ${msg.fromUser ? 'user' : 'bot'}`}>
              <span className="message_text">{msg.text}</span>
              <span className="message_time">{msg.time}</span>
            </div>

            {msg.cards && msg.cards.length > 0 && (
              <div className="chat_cards">
                {msg.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="chat_card"
                    onClick={() => setInput(card.title)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={getCardImage(card.title)} alt={card.title} className="card_image" />
                    <div className="card_content">
                      <div className="card_title">{card.title}</div>
                      <div className="card_subtitle">{card.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        {isLoading && (
          <div className="chat_message bot">
            <span className="message_text">Печатает...</span>
          </div>
        )}
      </div>

      {/* Попап с вводом кодового слова */}
      {showKeywordPopup && (
        <div className="keyword-popup-overlay">
          <div className="keyword-popup">
            <h3>Введите ваше кодовое слово</h3>
            <input
              type="text"
              value={keywordInput}
              onChange={e => setKeywordInput(e.target.value)}
              placeholder="Кодовое слово"
              autoFocus
            />
            <div className="keyword-hint">
              <button
                type="button"
                className="hint-button"
                onClick={() => setShowHint(!showHint)}
              >
                Показать подсказку
              </button>
              {showHint && (
                <div className="hint-text">
                  Имя первого питомца
                </div>
              )}
            </div>
            <button
              type="button"
              className="confirm-button"
              onClick={handleConfirmKeyword}
              disabled={!keywordInput.trim()}
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}

      <div className="chat_input_area">
        <button className="chat_attach_btn">
          <img src="../assets/clip-icon.png" alt="Attach" />
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          disabled={isLoading || showKeywordPopup}
        />
        <button
          className="chat_voice_btn"
          title="Голосовой ввод"
          onClick={handleSend}
          disabled={isLoading || showKeywordPopup}
        >
          <img src="../assets/voice-icon.png" alt="" />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
