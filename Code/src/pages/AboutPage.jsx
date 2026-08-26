import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Recycle,
  Search,
  MapPin,
  Truck,
  ShoppingBag,
  Sprout,
  HeartHandshake,
  ShieldCheck,
  Lightbulb,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const PILLARS = [
  {
    icon: Search,
    title: 'Device Disposal Guide',
    description:
      'Search any device for step-by-step disposal instructions, safety warnings, and the value locked inside it.',
    href: '/device-search',
    cta: 'Find your device',
  },
  {
    icon: MapPin,
    title: 'Recycling Center Map',
    description:
      'Locate verified recyclers near you on an interactive map, with ratings, services, and live filtering.',
    href: '/nearby-locations',
    cta: 'See nearby centers',
  },
  {
    icon: Truck,
    title: 'Pickup & Reuse Network',
    description:
      'Schedule a doorstep pickup and connect with certified recyclers and repairers who give devices a second life.',
    href: '/pickup-network',
    cta: 'Schedule a pickup',
  },
  {
    icon: ShoppingBag,
    title: 'Refurbished Marketplace',
    description:
      'Shop tested, refurbished devices at fair prices — keeping electronics in use and out of landfills.',
    href: '/disposables',
    cta: 'Browse disposables',
  },
];

const VALUES = [
  {
    icon: Sprout,
    title: 'Sustainability First',
    description:
      'Every feature is measured by one question: does it keep materials in the loop and waste out of the ground?',
  },
  {
    icon: Lightbulb,
    title: 'Practical Guidance',
    description:
      'No jargon, no guesswork. Clear steps for safe disposal, repair, and reuse — for every kind of device.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Verification',
    description:
      'We only point you to certified, vetted recyclers and honest product listings, so your choices are safe.',
  },
  {
    icon: HeartHandshake,
    title: 'Community Impact',
    description:
      'From doorstep pickups to affordable refurbished devices, we build access for people and the planet alike.',
  },
];

const IMPACT = [
  { icon: Recycle, value: '62M tonnes', label: 'of e-waste generated worldwide every year' },
  { icon: Target, value: '<20%', label: 'of e-waste is formally recycled today' },
  { icon: Leaf, value: '7x', label: 'more value from reuse than from raw recycling' },
  { icon: Users, value: '1', label: 'platform from awareness to action — that is us' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'About' },
          ].filter((item) => item.label !== 'Home')}
        />
      </div>

      {/* Hero — dark forest backdrop with the campaign message */}
      <section className="relative overflow-hidden bg-forest-900 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-forest-600/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-small uppercase tracking-widest text-gold-400 mb-6"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About ReCircuit
          </motion.p>
          <motion.h1
            className="text-display text-white mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Dispose Smarter.
            <br />
            Reuse Better.{' '}
            <span className="text-gradient-shimmer bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Save the Planet.
            </span>
          </motion.h1>
          <motion.p
            className="text-body md:text-lg text-forest-100/85 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ReCircuit is a full-stack platform that turns e-waste confusion into action —
            guiding people from safe disposal to verified recyclers, doorstep pickups, and
            refurbished devices that deserve a second life.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => navigate('/device-search')}
              className="inline-flex items-center justify-center gap-2 bg-white text-forest-700 font-semibold px-8 py-3.5 rounded-full hover:bg-forest-50 transition-all duration-300 hover:scale-105"
            >
              <Search size={18} />
              Explore the Device Guide
            </button>
            <button
              onClick={() => navigate('/circular-economy')}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <Recycle size={18} />
              Our Circular Mission
            </button>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              className="lg:sticky lg:top-28"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-small uppercase tracking-widest text-gold-600 mb-4">
                Our story
              </p>
              <h2 className="text-h1 text-ink-900 mb-6">
                E-waste is the fastest-growing waste stream.{' '}
                <span className="text-forest-600">Most people don't know what to do with it.</span>
              </h2>
              <p className="text-body text-ink-500 leading-relaxed">
                Every year the world discards tens of millions of tonnes of electronics. Buried in
                that waste are toxic materials that leak into soil and water — and valuable metals
                that could power new devices. The result is a double loss: our health and our
                resources.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  title: 'From confusion to action',
                  body: 'Most people want to dispose of devices responsibly, but don’t know how, where, or what happens next. ReCircuit answers those questions in one place — searchable disposal guides, verified recyclers on a map, and pickup scheduling, so the right choice is also the easy choice.',
                },
                {
                  title: 'Built for the circular economy',
                  body: 'Disposal is only half the story. We connect every guide and pickup to the wider loop — reduce, reuse, recycle — and back it with a marketplace where refurbished devices are bought and sold instead of scrapped.',
                },
                {
                  title: 'From awareness to real impact',
                  body: 'The platform walks users from “I have an old phone” to a certified recycler, a scheduled pickup, or a refurbished replacement — measuring success not in page views, but in devices kept in the loop.',
                },
              ].map((story, index) => (
                <motion.div
                  key={story.title}
                  className="card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-forest flex-shrink-0">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-h3 text-ink-900 mb-2">{story.title}</h3>
                      <p className="text-body text-ink-500 leading-relaxed">{story.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-small uppercase tracking-widest text-gold-600 mb-4">
              What we do
            </p>
            <h2 className="text-h1 text-ink-900 mb-6">
              One platform for the whole{' '}
              <span className="text-forest-600">e-waste journey</span>
            </h2>
            <p className="text-body text-ink-500 max-w-2xl mx-auto">
              Four connected experiences take users from a forgotten drawer to a verified recycler —
              and eventually to a device that lives again.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, index) => (
              <motion.button
                key={pillar.title}
                onClick={() => navigate(pillar.href)}
                className="card-interactive text-left"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="p-4 rounded-xl bg-gradient-forest w-fit">
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-display font-bold text-sage-200 leading-none select-none">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-h3 text-ink-900 mb-2">{pillar.title}</h3>
                <p className="text-body text-ink-500 mb-5 leading-relaxed">{pillar.description}</p>
                <span className="inline-flex items-center gap-1.5 text-small font-semibold text-forest-600">
                  {pillar.cta} <ArrowRight size={15} />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Impact band */}
      <section className="bg-gradient-forest py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-small uppercase tracking-widest text-gold-300 mb-4">
              Why it matters
            </p>
            <h2 className="text-h1 text-white mb-4">The problem we’re here to solve</h2>
            <p className="text-body text-white/80 max-w-2xl mx-auto">
              The numbers behind the mission — and why the “right” disposal is so often skipped.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl p-8 text-center bg-white/10 border border-white/15 backdrop-blur-sm"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className="p-3 rounded-xl bg-gold-400 w-fit mx-auto mb-5">
                  <stat.icon className="w-6 h-6 text-forest-900" />
                </div>
                <div className="text-stat text-gold-300 mb-2">{stat.value}</div>
                <p className="text-small text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-small uppercase tracking-widest text-gold-600 mb-4">
              What we stand for
            </p>
            <h2 className="text-h1 text-ink-900 mb-6">
              Values that shape every <span className="text-forest-600">decision</span>
            </h2>
            <p className="text-body text-ink-500 max-w-2xl mx-auto">
              The principles we design by, whether we’re writing disposal steps or picking a
              recycler partner.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                className="card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="p-4 rounded-xl bg-sage-100 w-fit mb-5">
                  <value.icon className="w-6 h-6 text-forest-700" />
                </div>
                <h3 className="text-h3 text-ink-900 mb-2">{value.title}</h3>
                <p className="text-body text-ink-500 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for HackMatrix */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="rounded-3xl border-2 border-forest-300 bg-gradient-subtle p-10 md:p-14 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="p-4 rounded-2xl bg-gradient-forest w-fit mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-small uppercase tracking-widest text-gold-600 mb-4">
              Made with purpose
            </p>
            <h2 className="text-h1 text-ink-900 mb-6">Built by Team AI-Alchemists</h2>
            <p className="text-body text-ink-500 max-w-2xl mx-auto leading-relaxed mb-8">
              ReCircuit was designed and built for HackMatrix with one goal in mind: make
              sustainable e-waste behaviour practical, not preachy. It combines a modern React
              frontend with a FastAPI backend and MongoDB — proving that real-world impact and
              solid engineering can ship together in a single hackathon sprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Leaf size={18} />
                Explore the Platform
              </button>
              <button
                onClick={() => navigate('/circular-economy')}
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                <Recycle size={18} />
                Learn the Circular Model
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
