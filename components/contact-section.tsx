"use client";

import React from "react"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "العنوان",
    details: "غزة، فلسطين",
  },
  {
    icon: Phone,
    title: "الهاتف",
    details: "+970 59 123 4567",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: "info@o2gaza.com",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    details: "يومياً من 10 صباحاً - 12 منتصف الليل",
  },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-wider mb-4 block">
            تواصل معنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            نحن في انتظارك
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            لديك سؤال أو اقتراح؟ تواصل معنا وسنرد عليك في أقرب وقت
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                أرسل لنا رسالة
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    تم إرسال رسالتك بنجاح!
                  </h4>
                  <p className="text-muted-foreground">
                    شكراً لتواصلك معنا، سنرد عليك في أقرب وقت.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="mt-6"
                  >
                    إرسال رسالة أخرى
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      الاسم الكامل
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك"
                      required
                      className="bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      className="bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      رسالتك
                    </label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا..."
                      required
                      rows={5}
                      className="bg-secondary/50 border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        إرسال الرسالة
                        <Send className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{info.title}</h4>
                      <p className="text-muted-foreground text-sm">{info.details}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border/50 h-[300px] bg-card">
              <iframe
                title="موقع مطعم أوتو غزة"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54115.11980889961!2d34.413536200000004!3d31.5017356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd7f054e542767%3A0x7ff98dc913046392!2sGaza%20City!5e0!3m2!1sen!2s!4v1705000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
