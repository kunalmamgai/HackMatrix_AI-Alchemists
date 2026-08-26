import { Mail, MapPin, Clock, Leaf, Share2, AtSign, Globe, Rss } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Real site sections — no placeholder SaaS boilerplate
  const footerLinks = [
    {
      category: 'Product',
      links: [
        { label: 'Device Guide', href: '/device-search' },
        { label: 'Locations', href: '/nearby-locations' },
        { label: 'Pickup Network', href: '/pickup-network' },
        { label: 'Marketplace', href: '/disposables' },
      ],
    },
    {
      category: 'Learn',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Circular Economy', href: '/circular-economy' },
        { label: 'Disposal Safety', href: '/device-search' },
      ],
    },
    {
      category: 'Get Involved',
      links: [
        { label: 'Become a Verified Center', href: '/pickup-network' },
        { label: 'Partner With Us', href: '/circular-economy' },
      ],
    },
    {
      category: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Globe, label: 'Website' },
    { icon: AtSign, label: 'Social' },
    { icon: Rss, label: 'Updates' },
    { icon: Share2, label: 'Share' },
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
    <footer className="bg-forest-800 border-t border-forest-700 py-16">
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
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-forest rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ReCircuit</span>
            </Link>
            <p className="text-sm text-forest-100/80 mt-4 mb-4">
              Reuse. Recycle. ReCircuit.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className="p-2 rounded-lg transition-colors bg-white/10 text-white hover:bg-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map(({ category, links }) => (
            <motion.div key={category} variants={itemVariants}>
              <h3 className="font-semibold text-sm mb-4 text-white">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors text-forest-100/80 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section — project-level, no personal details */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-forest-700"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: Mail, title: 'Email', content: 'hello@recircuit.app', href: 'mailto:hello@recircuit.app' },
            { icon: MapPin, title: 'Headquarters', content: 'Delhi, India' },
            { icon: Clock, title: 'Response Time', content: 'We reply within 48 hours' },
          ].map((contact, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-white"
              variants={itemVariants}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gradient-forest">
                  <contact.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-ink-900">
                    {contact.title}
                  </h4>
                  {contact.href ? (
                    <a href={contact.href} className="text-sm text-ink-500 hover:text-forest-600 transition-colors">
                      {contact.content}
                    </a>
                  ) : (
                    <p className="text-sm text-ink-500">{contact.content}</p>
                  )}
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
          <p className="text-sm text-forest-100/80">
            © {currentYear} ReCircuit. All rights reserved. | Reuse. Recycle. ReCircuit. — Electronics circular economy.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-white transition-colors text-forest-100/80">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors text-forest-100/80">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
