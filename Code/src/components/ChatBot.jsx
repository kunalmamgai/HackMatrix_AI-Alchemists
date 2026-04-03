import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

export default function ChatBot({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm EcoBot, your e-waste disposal assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Predefined responses based on keywords
    const responses = {
      'smartphone|phone|iphone|samsung|android': "📱 **Smartphone Disposal Guide:**\n\n1. Back up all your data\n2. Remove SIM and memory cards\n3. Factory reset your device\n4. Remove battery if possible\n5. Take to certified e-waste recycler\n\n**Valuable materials:** Copper, gold, rare metals\n\nWould you like more details?",
      
      'laptop|computer|macbook': "💻 **Laptop Disposal Guide:**\n\n1. Securely erase hard drive (DBAN or macOS erase)\n2. Remove battery (usually detachable)\n3. Disconnect all peripherals\n4. Pack in protective case\n5. Drop off at recycling center\n\n**Valuable materials:** Aluminum, copper, rare earth elements\n\nNeed more information?",
      
      'battery|harmful|hazardous': "⚠️ **Battery Disposal (HAZARDOUS):**\n\n**CRITICAL:**\n- Do NOT throw in regular trash\n- Risk of fire and explosion\n- Keep away from moisture and heat\n\n**Proper disposal:**\n1. Collect in non-metal container\n2. Store in cool, dry place\n3. Take to hazmat recycling facility\n4. Tape terminals to prevent short circuit\n\nDo you have other questions?",
      
      'recycling|recycle|center|location': "🔍 **Find Recycling Centers:**\n\nWe can help you locate certified e-waste recycling centers near you!\n\n1. Go to **'Locations'** page in navigation\n2. Enter your city or zip code\n3. View nearby recycling centers\n4. Schedule pickup if available\n\nWould you like help with anything else?",
      
      'price|cost|value|sell|buy|disposables': "💰 **Our Disposables Marketplace:**\n\nYou can buy refurbished electronics at great prices!\n\n✅ **Browse:** Go to 'Disposables' page\n✅ **Products:** Phones, Laptops, Tablets, Headphones, etc.\n✅ **Conditions:** Excellent to Good condition\n✅ **Checkout:** Secure payment options\n\nLogin required to purchase. Visit Disposables now?",
      
      'pickup|schedule|delivery': "🚚 **Pickup Service:**\n\nWe offer convenient e-waste pickup!\n\n1. Go to **'Pickup Network'** page\n2. Enter your address\n3. Select items for pickup\n4. Schedule convenient time\n5. We collect from your doorstep\n\nWould you like to schedule a pickup?",
      
      'help|guide|how|support': "📖 **How Can I Help You?**\n\nYou can ask me about:\n\n✅ Device disposal instructions\n✅ Recycling center locations\n✅ Buying refurbished electronics\n✅ Pickup service\n✅ Environmental impact\n✅ Safety tips for e-waste\n\nWhat would you like to know?",
      
      'environment|impact|green|sustainable': "🌍 **Environmental Impact:**\n\n**E-waste is serious:**\n- 57 million tons discarded yearly\n- Contains toxic materials\n- Pollutes soil and water\n\n**By recycling:**\n✅ Recover valuable metals\n✅ Reduce landfill waste\n✅ Protect the environment\n✅ Support circular economy\n\nJoin us in sustainable electronics!\n\nWant to learn more about our mission?",
      
      'thank|thanks|appreciate': "😊 **You're welcome!**\n\nHappy to help! If you have more questions about:\n- Device disposal\n- Recycling services\n- Our product range\n\nJust ask anytime! 💚",
      
      'bye|goodbye|later|exit': "👋 **Goodbye!**\n\nThanks for using EcoBot. Remember to recycle responsibly!\n\n💚 Keep it green!",
    };

    // Find matching response
    for (const [keywords, response] of Object.entries(responses)) {
      const keywordArray = keywords.split('|');
      if (keywordArray.some(keyword => lowerMessage.includes(keyword))) {
        return response;
      }
    }

    // Default response
    return "Thanks for your question! 😊\n\nI can help you with:\n- **Device disposal guides** (phones, laptops, batteries, etc.)\n- **Recycling center locations**\n- **Purchasing refurbished electronics**\n- **Pickup service scheduling**\n- **Environmental information**\n\nWhat would you like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(async () => {
      const botResponse = await getBotResponse(inputValue);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${
          darkMode
            ? 'bg-gradient-eco text-white hover:shadow-eco'
            : 'bg-gradient-eco text-white hover:shadow-eco'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageCircle size={24} />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-24 right-6 z-40 w-96 max-h-screen md:max-h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-eco text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">EcoBot</h3>
                <p className="text-sm text-green-100">Always here to help</p>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-xl ${
                      message.sender === 'user'
                        ? 'bg-eco-500 text-white rounded-br-none'
                        : darkMode
                        ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-eco-500"
                >
                  <Loader size={16} className="animate-spin" />
                  <span>EcoBot is typing...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className={`flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2 rounded-full bg-gradient-eco text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}