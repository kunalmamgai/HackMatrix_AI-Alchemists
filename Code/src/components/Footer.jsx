import { Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer({ darkMode }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: ['Features', 'Pricing', 'Security', 'Updates'],
    Company: ['About Us', 'Careers', 'Blog', 'Press'],
    Resources: ['Documentation', 'Help Center', 'API', 'Community'],
    Legal: ['Privacy', 'Terms', 'License', 'Settings'],
  };

  const socialLinks = [
    { emoji: '👍', label: 'Facebook' },
    { emoji: '𝕏', label: 'Twitter' },
    { emoji: '💼', label: 'LinkedIn' },
    { emoji: '⚙️', label: 'GitHub' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants}>
            <div className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🌍 E-Scarpe Mart
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Making e-waste disposal smart, accessible, and sustainable for everyone.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-eco-400 hover:bg-eco-600 hover:text-white' : 'bg-white text-eco-600 hover:bg-eco-600 hover:text-white border border-gray-200'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{social.emoji}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], colIndex) => (
            <motion.div key={category} variants={itemVariants}>
              <h3 className={`font-semibold text-sm mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className={`text-sm transition-colors hover:text-eco-500 ${darkMode ? 'text-gray-400 hover:text-eco-400' : 'text-gray-600'}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: Mail, title: 'Email', content: 'kunalmamgai@gmail.com' },
            { icon: Phone, title: 'Phone', content: '+918077827990' },
            { icon: MapPin, title: 'Address', content: 'Delhi Headquarters, India' },
          ].map((contact, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              variants={itemVariants}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gradient-eco">
                  <contact.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {contact.title}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {contact.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {currentYear} E-Scarpe Mart. All rights reserved. | Our Mission: Dispose Smarter. Reuse Better. Save the Planet.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className={`text-sm hover:text-eco-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Privacy Policy
            </a>
            <a href="#" className={`text-sm hover:text-eco-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Terms of Service
            </a>
            <a href="#" className={`text-sm hover:text-eco-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Cookie Settings
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
