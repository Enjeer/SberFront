import React, { useState, useEffect, useRef } from 'react';
import './chatComponent.css';

// Импорт изображений
import SberLisIcon from '../../public/assets/Sber_Lis_Icon.png';
import clipIcon from '../../public/assets/clip-icon.png';
import voiceIcon from '../../public/assets/voice-icon.png';
import UltraCard from '../../public/assets/UltraCard_2_0.png';
import BelcardPremium from '../../public/assets/BelcardPremium.png';
import SberCard from '../../public/assets/SberCard.png';
import defaultCard from '../../public/assets/defaultCard.png';
import eyeOpen from '../../public/assets/el_eye-open.png';
import eyeClose from '../../public/assets/el_eye-close.png';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [containerHeight, setContainerHeight] = useState('100%');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeywordPopup, setShowKeywordPopup] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(700);
  const [firstRender, setFirstRender] = useState(true);

  const headerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const AI21_API_KEY = '1dd1f7fd-7fc0-4973-a7b2-b459943efe4b';

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Отправка приветственного сообщения при первом рендере
  useEffect(() => {
    if (firstRender) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([{
        text: 'Привет! Я СберЛис, ваш персональный помощник. Чем могу помочь?',
        fromUser: false,
        time,
        buttons: [
          { text: 'Звонок в банк', action: 'call' },
          { text: 'Перейти в Telegram', action: 'telegram' }
        ]
      }]);
      setFirstRender(false);
    }
  }, [firstRender]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Обновление высоты контейнера
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setContainerHeight(`calc(100% - ${headerHeight}px)`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Локальный детектор команд
  const detectSpecialCommands = (text) => {
    const lowerText = text.toLowerCase();
    
    if (/(оформить карту|какие карты|карты сбербанка|выбрать карту)/i.test(lowerText)) {
      return 'SHOW_CARDS';
    }
    
    if (/(ultra card 2\.0|сбер карта|белкарт премиум)/i.test(lowerText)) {
      return 'SHOW_KEY_WORD';
    }
    
    if (/(бюджет|распределить финансы|планирование расходов|спланировать траты)/i.test(lowerText)) {
      return 'SHOW_BUDGET';
    }
    
    if (/(скидки|партнеры|магазины со скидкой|выгодные покупки)/i.test(lowerText)) {
      return 'SHOW_PARTNERS';
    }
    
    if (/(перевести|отправить деньги|сделать перевод)/i.test(lowerText)) {
      return 'SHOW_TRANSACTIONS';
    }
    
    if (/(баланс|сколько денег|остаток на счете)/i.test(lowerText)) {
      return 'BALANCE';
    }
    
    if (/(курс доллара|курс евро|курс валют)/i.test(lowerText)) {
      return 'EXCHANGE';
    }
    
    return null;
  };

  // Системное сообщение для AI
  const buildSystemMessage = () => ({
    role: 'system',
    content: `
Ты — умный и дружелюбный помощник по имени СберЛис. Ты помогаешь клиентам Сбербанка с банковскими вопросами.

🧠 Общие правила:
— Отвечай дружелюбно, понятно и лаконично.
— Если не знаешь ответа — скажи об этом и предложи альтернативную помощь.
— Для финансовых операций используй только безопасные методы.
— Никогда не запрашивай конфиденциальные данные (пароли, пин-коды, CVV).

💼 Основные принципы работы:
1. Для операций с картами, бюджетами, переводами и партнерскими предложениями я буду показывать специальные интерфейсы
2. Ты отвечаешь на общие вопросы и обрабатывай сложные запросы
3. Все финансовые операции подтверждаются через безопасные методы банка

📌 Как отвечать на частые запросы:

🪙 Баланс:
— Всегда проверяй последние данные перед ответом
— Пример: «Сейчас на вашем основном счете 1250 BYN. Хотите детализацию операций?»

💱 Курсы валют:
— Используй актуальные курсы ЦБ РБ
— Пример: «Курс доллара: 2.55 BYN, евро: 2.85 BYN. Сколько хотите обменять?»

📊 История операций:
— Отображай только обобщенные данные
— Пример: «За неделю вы потратили 350 BYN. Самые крупные траты: продукты (150 BYN), транспорт (80 BYN)»

📅 Напоминания:
— Предлагай удобные сроки напоминаний
— Пример: «Платеж по кредиту 15 июня. Напомнить за 3 дня?»

🔐 Безопасность:
— Никогда не предлагай разблокировку карты онлайн
— Пример: «Для смены PIN-кода посетите отделение с паспортом»

📦 Мои продукты:
— Перечисляй только типы продуктов без деталей
— Пример: «У вас 2 карты, 1 вклад и кредит. Нужны детали по конкретному продукту?»

📘 Термины:
— Объясняй простыми словами
— Пример: «Кэшбэк — возврат части потраченных денег при покупках»

⚙️ Настройки:
— Предлагай только безопасные изменения
— Пример: «Сменить язык можно в профиле приложения»

📍 Отделения и банкоматы:
— Давай точные адреса
— Пример: «Ближайший банкомат: ул. Ленина, 15 (500 м от вас)»

📄 Документы:
— Предлагай только электронные справки
— Пример: «Выписку за апрель можно скачать в PDF»

📬 Заявки:
— Давай только общий статус
— Пример: «Ваша заявка на кредит обрабатывается, решение будет через 1-2 дня»

🧾 Сложные запросы:
— Если запрос требует финансовых операций — объясни безопасный способ
— Пример: «Для перевода крупной суммы посетите отделение с документом»

💡 Важно:
— При запросе "Сбер Карта" или других конкретных продуктов — я покажу специальный интерфейс
— Для переводов, бюджета и партнерских предложений тоже будут специальные интерфейсы
— Ты отвечаешь только текстом, без специальных команд
`
  });

  // Обработка API запроса
  const handleApiRequest = async (messages, userMessage) => {
    try {
      const systemMessage = buildSystemMessage();
      const visibleMessages = messages.filter(msg => !msg.hidden);
      const lastUserMessages = [...visibleMessages, userMessage].filter(m => m.fromUser).slice(-5);

      const requestBody = {
        model: "jamba-large-1.6-2025-03",
        messages: [
          systemMessage,
          ...lastUserMessages.map(msg => ({ role: "user", content: msg.text }))
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

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('API request failed:', error);
      return 'Ошибка соединения с сервером';
    }
  };

  // Обработка нажатия кнопок
  const handleButtonClick = (action) => {
    if (action === 'call') {
      window.location.href = 'tel:+375291234567';
    } else if (action === 'telegram') {
      window.open('https://t.me/sberbank_belarus', '_blank');
    }
  };

  // Отправка сообщения
  const handleSend = async (customInput = null) => {
    const messageText = customInput ?? input.trim();
    if (!messageText) return;

    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMessage = { text: messageText, fromUser: true, time, hidden: !!customInput };
    setMessages(prev => [...prev, userMessage]);

    setInput('');
    setIsLoading(true);

    try {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const command = detectSpecialCommands(messageText);

      // Обработка локальных команд
      if (command) {
        switch(command) {
          case 'SHOW_CARDS':
            setMessages(prev => [...prev, {
              text: 'Какую карту вы хотите оформить? Вот несколько популярных вариантов 👇🏻',
              fromUser: false,
              time: botTime,
              type: 'cards',
              data: [
                { title: 'СберКарта', subtitle: 'Бесплатное обслуживание, кэшбэк до 10%' },
                { title: 'Белкарт Премиум', subtitle: 'Срок действия: 5 лет, обслуживание: 20 BYN' },
                { title: 'Ultra Card 2.0', subtitle: 'Премиальные привилегии, расширенная страховка' }
              ]
            }]);
            break;
            
          case 'SHOW_KEY_WORD':
            setShowKeywordPopup(true);
            break;
            
          case 'SHOW_BUDGET':
            setMessages(prev => [...prev, {
              text: `Чтобы составить бюджет на ${budgetAmount} BYN, я могу помочь распределить сумму по категориям расходов. Например:`,
              fromUser: false,
              time: botTime,
              type: 'budget',
              data: [
                { title: 'Еда', amount: `${Math.round(budgetAmount * 0.3)} BYN` },
                { title: 'Жильё и коммуналка', amount: `${Math.round(budgetAmount * 0.3)} BYN` },
                { title: 'Транспорт', amount: `${Math.round(budgetAmount * 0.1)} BYN` },
                { title: 'Развлечения и отдых', amount: `${Math.round(budgetAmount * 0.15)} BYN` },
                { title: 'Накопления или инвестиции', amount: `${Math.round(budgetAmount * 0.05)} BYN` },
                { title: 'Прочее', amount: `${Math.round(budgetAmount * 0.1)} BYN` }
              ],
              budgetActions: true
            }]);
            break;
            
          case 'SHOW_PARTNERS':
            setMessages(prev => [...prev, {
              text: 'Вот магазины со скидками:',
              fromUser: false,
              time: botTime,
              type: 'partners',
              data: [
                { title: 'ZEBRA', discount: '0.5%' },
                { title: 'PRONAIL', discount: '2%' },
                { title: 'Sattini', discount: '1%' }
              ]
            }]);
            break;
            
          case 'SHOW_TRANSACTIONS':
            setMessages(prev => [...prev, {
              text: 'Выберите получателя:',
              fromUser: false,
              time: botTime,
              type: 'transactions',
              data: [
                { title: 'Петров В.С.', subtitle: '**** 5678' },
                { title: 'Васильев А.Б.', subtitle: '**** 9012' },
                { title: 'Васильев М.П.', subtitle: '**** 3456' }
              ]
            }]);
            break;
            
          case 'BALANCE':
            setMessages(prev => [...prev, {
              text: 'На вашей карте сейчас 1 250 BYN. Хотите увидеть последние операции?',
              fromUser: false,
              time: botTime
            }]);
            break;
            
          case 'EXCHANGE':
            setMessages(prev => [...prev, {
              text: 'Курс доллара сегодня 2.55 BYN. Хотите обменять валюту?',
              fromUser: false,
              time: botTime
            }]);
            break;
        }
        return;
      }

      // Если команда не найдена - обращаемся к API
      const aiResponse = await handleApiRequest(messages, userMessage);
      
      if (aiResponse === '[SHOW_CARDS]') {
        setMessages(prev => [...prev, {
          text: 'Какую карту вы хотите оформить? Вот несколько популярных вариантов 👇🏻',
          fromUser: false,
          time: botTime,
          type: 'cards',
          data: [
            { title: 'СберКарта', subtitle: 'Бесплатное обслуживание, кэшбэк до 10%' },
            { title: 'Белкарт Премиум', subtitle: 'Срок действия: 5 лет, обслуживание: 20 BYN' },
            { title: 'Ultra Card 2.0', subtitle: 'Премиальные привилегии, расширенная страховка' }
          ]
        }]);
      } 
      else if (aiResponse === '[SHOW_KEY_WORD]') {
        setShowKeywordPopup(true);
      }
      else {
        setMessages(prev => [...prev, { 
          text: aiResponse, 
          fromUser: false, 
          time: botTime 
        }]);
      }

    } catch (error) {
      const errorTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        text: 'Ошибка соединения с сервером',
        fromUser: false,
        time: errorTime
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Действия с бюджетом
  const handleBudgetAction = (action) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (action === 'adjust') {
      setMessages(prev => [...prev, {
        text: 'Хорошо! Введите новую сумму бюджета или назовите категории для изменения.',
        fromUser: false,
        time
      }]);
    } else if (action === 'add_goal') {
      setMessages(prev => [...prev, {
        text: 'Отлично! Какую финансовую цель вы хотите добавить? Например: "Накопить на отпуск 500 BYN"',
        fromUser: false,
        time
      }]);
    } else if (action === 'save') {
      setMessages(prev => [...prev, {
        text: 'Бюджет сохранён! Я буду следить за вашими тратами и напомню, если вы приблизитесь к лимиту.',
        fromUser: false,
        time
      }]);
    }
  };

  // Подтверждение кодового слова
  const handleConfirmKeyword = () => {
    if (!keywordInput.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const hiddenMessage = {
      text: keywordInput.trim(),
      fromUser: true,
      time,
      hidden: true
    };
    setMessages(prev => [...prev, hiddenMessage]);

    setShowKeywordPopup(false);
    setShowHint(false);
    setKeywordInput('');

    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        text: 'Кодовое слово отправлено',
        fromUser: false,
        time: botTime
      },
      {
        text: 'Карта оформлена! Посмотрите её в списке карт или следите за статусом выпуска по ссылке:\n\n🔗 Открыть карту',
        fromUser: false,
        time: botTime
      }
    ]);
  };

  // Обработка нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      if (showKeywordPopup) {
        handleConfirmKeyword();
      } else {
        handleSend();
      }
    }
  };

  // Получение изображения карты
  const getCardImage = (title) => {
    switch (title.toLowerCase()) {
      case 'ultra card 2.0':
      case 'ultracard 2.0':
        return UltraCard;
      case 'белкарт премиум':
      case 'belkart премиум':
        return BelcardPremium;
      case 'сберкарта':
      case 'sberкарта':
      case 'sbercard':
        return SberCard;
      default:
        return defaultCard;
    }
  };

  // Рендеринг сообщений
  const renderMessages = () => {
    let previousWasBot = false;

    return messages
      .filter(msg => !msg.hidden)
      .map((msg, index) => {
        const isBot = !msg.fromUser;
        const showIcon = isBot && !previousWasBot;
        previousWasBot = isBot;

        return (
          <React.Fragment key={index}>
            <div className={`chat_message ${msg.fromUser ? 'user' : 'bot'}`}>
              {isBot && (
                <div className="bot_avatar">
                  {showIcon ? <img src={SberLisIcon} alt="Bot" /> : <div style={{ width: 40 }} />}
                </div>
              )}
              <div className="message_content">
                <span className="message_text">{msg.text}</span>
                <span className="message_time">{msg.time}</span>
              </div>
            </div>

            {/* Кнопки действий */}
            {msg.buttons && (
              <div className="message_buttons">
                {msg.buttons.map((button, idx) => (
                  <button
                    key={idx}
                    className="action_button"
                    onClick={() => handleButtonClick(button.action)}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            )}

            {/* Карточки продуктов */}
            {msg.type === 'cards' && (
              <div className="chat_cards">
                {msg.data.map((card, idx) => (
                  <div
                    key={idx}
                    className="chat_card"
                    onClick={() => { setInput(card.title); handleSend(card.title); }}
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

            {/* Карточки бюджета */}
            {msg.type === 'budget' && (
              <>
                <div className="chat_cards">
                  {msg.data.map((item, idx) => (
                    <div key={idx} className="chat_card budget_card">
                      <div className="card_content">
                        <div className="card_title">{item.title}</div>
                        <div className="card_subtitle">{item.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {msg.budgetActions && (
                  <div className="budget_actions">
                    <button onClick={() => handleBudgetAction('adjust')}>Настроить</button>
                    <button onClick={() => handleBudgetAction('add_goal')}>Добавить цель</button>
                    <button onClick={() => handleBudgetAction('save')}>Сохранить</button>
                  </div>
                )}
              </>
            )}

            {/* Партнерские скидки */}
            {msg.type === 'partners' && (
              <div className="chat_cards">
                {msg.data.map((partner, idx) => (
                  <div key={idx} className="chat_card">
                    <div className="card_content">
                      <div className="card_title">{partner.title}</div>
                      <div className="card_subtitle">Скидка: {partner.discount}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Получатели переводов */}
            {msg.type === 'transactions' && (
              <div className="chat_cards">
                {msg.data.map((recipient, idx) => (
                  <div 
                    key={idx} 
                    className="chat_card"
                    onClick={() => { 
                      setInput(recipient.title); 
                      handleSend(recipient.title); 
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card_content">
                      <div className="card_title">{recipient.title}</div>
                      <div className="card_subtitle">{recipient.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="chat_component_container" style={{ height: containerHeight }}>
      <nav className="chat_nav" ref={headerRef}>
        <img src={SberLisIcon} alt="logo" />
        <span>СберЛис</span>
        <button></button>
      </nav>

      <div className="chat_messages">
        {renderMessages()}
        {isLoading && (
          <div className="chat_message bot">
            <div className="bot_avatar">
              <img src={SberLisIcon} alt="Bot" />
            </div>
            <div className="message_content">
              <span className="message_text">Печатает...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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
              <button type="button" className="hint-button" onClick={() => setShowHint(!showHint)}>Подсказка</button>
              <img src={showHint ? eyeOpen : eyeClose} alt="Hint eye" />
              {showHint && <div className="hint-text">Имя питомца</div>}
              <button type="button" className="hint-button" onClick={() => alert("Пожалуйста, обратитесь в отделение банка")}>
                Не помню
              </button>
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
          <img src={clipIcon} alt="Attach" />
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
          onClick={() => handleSend()}
          disabled={isLoading || showKeywordPopup}
        >
          <img src={voiceIcon} alt="Voice input" />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
