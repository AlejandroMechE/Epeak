"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Rocket, Shield, Settings, CreditCard, SearchX } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import styles from "./FAQSection.module.css";

interface FAQ {
  id: string;
  category: string;
  question_en: string;
  question_es: string;
  answer_en: string;
  answer_es: string;
  order_index: number;
}

interface FAQSectionProps {
  lang: string;
  dict: any;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Getting Started": <Rocket size={16} />,
  "Technical": <Settings size={16} />,
  "Security": <Shield size={16} />,
  "Billing": <CreditCard size={16} />,
};

export default function FAQSection({ lang, dict }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (!error && data) {
        setFaqs(data as FAQ[]);
      }
      setLoading(false);
    };

    fetchFAQs();
  }, []);

  const categories = ["all", ...new Set(faqs.map(f => f.category))];

  const filteredFaqs = faqs.filter(faq => {
    const q = lang === "es" ? faq.question_es : faq.question_en;
    const a = lang === "es" ? faq.answer_es : faq.answer_en;
    const matchesSearch = 
      q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const supportDict = dict.portal.support;

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={supportDict.faq_search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.categoriesHUD}>
        {categories.map((cat) => {
          const catKey = cat.toLowerCase().replace(" ", "_");
          const label = supportDict.categories[catKey] || cat;
          return (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${activeCategory === cat ? styles.activeCategory : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className={styles.catFlex}>
                {cat !== "all" && CATEGORY_ICONS[cat]}
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.accordion}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const question = lang === "es" ? faq.question_es : faq.question_en;
            const answer = lang === "es" ? faq.answer_es : faq.answer_en;

            return (
              <div 
                key={faq.id} 
                className={`${styles.faqItem} ${isExpanded ? styles.expanded : ""}`}
              >
                <button 
                  className={styles.question}
                  onClick={() => toggleExpand(faq.id)}
                >
                  <div className={styles.qText}>
                    <span className={styles.categoryTag}>{faq.category}</span>
                    {question}
                  </div>
                  <ChevronDown className={styles.chevron} size={18} />
                </button>
                <div className={styles.answer}>
                  <div className={styles.answerInner}>
                    {answer}
                  </div>
                </div>
              </div>
            );
          })
        ) : !loading && (
          <div className={styles.emptyResults}>
            <SearchX size={40} className={styles.noResultsIcon} />
            <p className={styles.noResultsText}>{supportDict.no_faq_results}</p>
          </div>
        )}
      </div>
    </div>
  );
}
