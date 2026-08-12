import { Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
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
    <footer className={`bg-gray-900 border-t border-gray-800 py-16`}>
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
            <div className={`text-2xl font-bold mb-4 text-white`}>
              🌍 E-Scrape Mart
            </div>
            <p className={`text-sm text-gray-400 mb-4`}>
              Making e-waste disposal smart, accessible, and sustainable for everyone.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`p-2 rounded-lg transition-colors bg-gray-800 text-eco-400 hover:bg-eco-600 hover:text-white`}
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
              <h3 className={`font-semibold text-sm mb-4 text-white`}>
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className={`text-sm transition-colors hover:text-eco-500 text-gray-400 hover:text-eco-400`}
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
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-gray-800`}
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
              className={`p-4 rounded-xl bg-gray-800`}
              variants={itemVariants}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gradient-eco">
                  <contact.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold text-sm text-white`}>
                    {contact.title}
                  </h4>
                  <p className={`text-sm text-gray-400`}>
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
          <p className={`text-sm text-gray-400`}>
            © {currentYear} E-Scrape Mart. All rights reserved. | Our Mission: Dispose Smarter. Reuse Better. Save the Planet.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className={`text-sm hover:text-eco-500 transition-colors text-gray-400`}>
              Privacy Policy
            </a>
            <a href="#" className={`text-sm hover:text-eco-500 transition-colors text-gray-400`}>
              Terms of Service
            </a>
            <a href="#" className={`text-sm hover:text-eco-500 transition-colors text-gray-400`}>
              Cookie Settings
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
