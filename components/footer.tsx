"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#menu", label: "قائمتنا" },
  { href: "#gallery", label: "معرض الصور" },
  { href: "#contact", label: "تواصل معنا" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "فيسبوك" },
  { icon: Instagram, href: "#", label: "إنستغرام" },
  { icon: Twitter, href: "#", label: "تويتر" },
  { icon: Youtube, href: "#", label: "يوتيوب" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold">
                <span className="text-primary">O2</span>{" "}
                <span className="text-foreground">Gaza</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6">
              تجربة طعام استثنائية تجمع بين الأصالة والحداثة، حيث نقدم لكم أشهى المأكولات في أجواء راقية.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>غزة، فلسطين</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span dir="ltr">+970 59 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@o2gaza.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">ساعات العمل</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex justify-between">
                <span>السبت - الخميس</span>
                <span>10:00 ص - 12:00 م</span>
              </li>
              <li className="flex justify-between">
                <span>الجمعة</span>
                <span>2:00 م - 12:00 م</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
            <p>
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مطعم O2 Gaza
            </p>
            <p>
              صُنع بحب في غزة
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
