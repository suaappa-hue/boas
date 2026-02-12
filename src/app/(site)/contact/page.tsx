'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const fundTypes: string[] = []
    formData.getAll('fundType').forEach(v => fundTypes.push(v as string))

    const data = {
      company: (formData.get('company-name') as string)?.trim() || '',
      bizno: '',
      name: (formData.get('ceo-name') as string)?.trim() || '',
      phone: (formData.get('phone') as string)?.trim() || '',
      email: '',
      industry: '',
      founded: '',
      consultTime: (formData.get('consult-time') as string) || '',
      amount: (formData.get('amount') as string) || '',
      fundType: fundTypes.join(', '),
      message: (formData.get('message') as string) || '',
    }

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        alert('상담 신청이 완료되었습니다. 24시간 내 연락드리겠습니다.')
        form.reset()
      } else {
        alert('신청 중 오류가 발생했습니다. 전화(1533-9269)로 문의해주세요.')
      }
    } catch {
      alert('네트워크 오류가 발생했습니다. 전화(1533-9269)로 문의해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const faqs = [
    { q: '정책자금 상담 비용이 정말 무료인가요?', a: '네, 초기 상담은 100% 무료입니다. 기업 현황 분석부터 최적의 정책자금 전략 제시까지 비용 부담 없이 전문 컨설턴트 상담을 받으실 수 있습니다. 상담 후 실제 신청 진행 시에만 별도 비용이 발생합니다.' },
    { q: '정책자금 상담 시간은 얼마나 걸리나요?', a: '기본 상담은 약 30분~1시간 정도 소요됩니다. 기업 현황과 필요한 자금 규모에 따라 시간이 달라질 수 있으며, 충분한 시간을 가지고 상세히 상담해 드립니다.' },
    { q: '정책자금 신청에 어떤 서류가 필요한가요?', a: '초기 상담 시에는 별도 서류 준비가 필요하지 않습니다. 기업 기본 정보(업종, 설립일, 직원 수 등)만 알고 계시면 됩니다. 필요한 서류는 상담 후 맞춤 전략 수립 단계에서 안내해 드립니다.' },
    { q: '이미 정책자금을 받고 있어도 추가 상담이 가능한가요?', a: '네, 상담 가능합니다. 이미 정책자금을 받고 계신 경우에도 추가로 신청 가능한 정책자금이 있거나, 기업인증을 통해 더 유리한 조건으로 재신청할 수 있습니다. 현재 상황을 분석하여 최적의 추가 자금조달 방안을 안내해 드립니다.' },
    { q: '상담 후 컨설팅 계약은 필수인가요?', a: '아니요, 상담 후 계약은 전혀 강제되지 않습니다. 상담을 통해 제시된 자금조달 전략을 충분히 검토하신 후, 필요하다고 판단되실 때만 진행하시면 됩니다. 부담 없이 상담받으실 수 있습니다.' },
    { q: '소규모 중소기업도 정책자금 상담이 가능한가요?', a: '물론입니다. 1인 기업부터 중소기업까지 규모와 관계없이 모두 상담 가능합니다. 각 기업의 규모와 특성에 맞는 최적의 정책자금 지원 방안을 제시해 드립니다.' },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .boas-contact-hero{background:linear-gradient(135deg,#FFFFFF 0%,var(--dark-bg) 100%);padding:0;margin:0;min-height:auto;display:flex;align-items:flex-start}
        .boas-contact-hero-container{max-width:1200px;margin:0 auto;padding:60px 48px;display:grid;grid-template-columns:1.2fr 1fr;gap:64px;align-items:center;width:100%}
        .boas-contact-hero-content{max-width:600px}
        .boas-contact-hero-headline{font-size:48px;font-weight:700;color:#000;line-height:1.25;margin-bottom:20px;letter-spacing:-0.02em;animation:fadeInUp .8s ease-out}
        .boas-contact-hero-subheadline{font-size:18px;font-weight:400;color:#666;line-height:1.7;margin-bottom:36px;animation:fadeInUp .8s ease-out .2s both}
        .boas-contact-hero-cta-group{display:flex;gap:16px;flex-wrap:wrap;animation:fadeInUp .8s ease-out .4s both}
        .boas-contact-hero-disclaimer{font-size:13px;color:#999;line-height:1.6;margin-top:20px}
        .boas-contact-hero-visual{position:relative;display:flex;align-items:center;justify-content:center;animation:fadeIn 1s ease-out .6s both}
        .boas-contact-hero-visual img{width:100%;max-width:500px;height:auto;aspect-ratio:1/1;object-fit:cover;object-position:70% center;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.15)}
        .boas-floating-consult,.boas-floating-overlay,.boas-bottom-nav{display:none!important}
        .boas-contact-process{background:linear-gradient(135deg,#f7f5f0 0%,var(--dark-bg) 100%);padding:100px 0}
        .boas-process-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;position:relative}
        .boas-process-step-card{text-align:center;position:relative}
        .boas-step-icon-wrap{width:100px;height:100px;margin:0 auto 24px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;box-shadow:0 8px 20px rgba(0,0,0,0.1);transition:all .3s ease}
        .boas-step-icon-wrap svg{width:48px;height:48px;color:var(--cyan);stroke:var(--cyan);transition:all .3s ease}
        .boas-step-number-badge{position:absolute;top:-10px;right:-10px;width:32px;height:32px;background:var(--cyan);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;border:3px solid #f7f5f0}
        .boas-process-step-card::after{content:'';position:absolute;top:50px;left:calc(50% + 50px);width:calc(100% - 100px);height:2px;background:linear-gradient(90deg,var(--cyan) 0%,var(--cyan-dark) 100%);z-index:0}
        .boas-process-step-card:last-child::after{display:none}
        .boas-step-card-title{font-size:20px;font-weight:700;color:#000;margin-bottom:12px;line-height:1.3;transition:color .3s ease}
        .boas-step-card-desc{font-size:15px;color:#666;line-height:1.6}
        @media(min-width:768px){
          .boas-process-step-card:hover .boas-step-icon-wrap{transform:translateY(-8px);box-shadow:0 12px 30px rgba(0, 212, 216,0.4)}
          .boas-process-step-card:hover .boas-step-icon-wrap svg{transform:scale(1.1)}
          .boas-process-step-card:hover .boas-step-card-title{color:var(--cyan)}
        }
        .boas-contact-faq{background:#fff;padding:100px 0}
        .boas-faq-list{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
        .boas-faq-item{background:#fff;border:2px solid #E5E7EB;border-radius:12px;overflow:hidden;transition:all .3s ease}
        .boas-faq-item:hover{border-color:var(--cyan);box-shadow:0 4px 12px rgba(0, 212, 216,0.15)}
        .boas-faq-item.active{border-color:var(--cyan);box-shadow:0 8px 20px rgba(0, 212, 216,0.2)}
        .boas-faq-question{width:100%;display:flex;align-items:center;justify-content:space-between;padding:24px 28px;background:transparent;border:none;cursor:pointer;text-align:left;transition:all .3s ease;font-family:inherit}
        .boas-faq-question:hover{background:#F9FAFB}
        .boas-faq-item.active .boas-faq-question{background:var(--cyan-lighter)}
        .boas-faq-question-inner{display:flex;align-items:center;flex:1}
        .boas-faq-label{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:var(--cyan);color:#fff;font-size:14px;font-weight:700;border-radius:6px;margin-right:12px;flex-shrink:0}
        .boas-faq-question-text{font-size:18px;font-weight:600;color:#000;line-height:1.5;padding-right:20px;flex:1}
        .boas-faq-icon{flex-shrink:0;width:32px;height:32px;background:#F3F4F6;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .3s ease}
        .boas-faq-item.active .boas-faq-icon{background:var(--cyan);transform:rotate(180deg)}
        .boas-faq-icon svg{width:18px;height:18px;color:#666;stroke:#666;transition:all .3s ease}
        .boas-faq-item.active .boas-faq-icon svg{color:#fff;stroke:#fff}
        .boas-faq-answer{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease}
        .boas-faq-item.active .boas-faq-answer{max-height:500px;padding:0 28px 28px}
        .boas-faq-answer-text{font-size:16px;color:#666;line-height:1.8}
        .boas-contact-form-section{background:linear-gradient(135deg,#f7f5f0 0%,var(--dark-bg) 100%);padding:100px 0}
        .boas-form-wrapper{display:grid;grid-template-columns:300px 1fr;gap:60px;align-items:stretch}
        .boas-form-info{display:flex;flex-direction:column;width:300px}
        .boas-info-title{font-size:36px;font-weight:700;color:#000;line-height:1.3;margin-bottom:20px;letter-spacing:-0.02em}
        .boas-info-title .highlight{color:var(--cyan)}
        .boas-info-desc{font-size:17px;color:#666;line-height:1.7;margin-bottom:32px}
        .boas-info-image{margin-bottom:24px;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.12);width:100%;flex:1 1 0;min-height:200px;display:flex}
        .boas-info-image img{width:100%;height:100%;object-fit:cover;object-position:center 20%;display:block;flex:1}
        .boas-contact-box{background:#fff;border:2px solid var(--cyan-lighter);border-radius:12px;padding:20px;width:100%;flex-shrink:0}
        .boas-contact-box-item{display:flex;align-items:center;gap:12px;margin-bottom:12px}
        .boas-contact-box-item:last-child{margin-bottom:0}
        .boas-contact-box-item svg{width:24px;height:24px;color:var(--cyan);flex-shrink:0}
        .boas-contact-box-text{font-size:15px;color:#333}
        .boas-contact-box-text strong{font-size:20px;font-weight:700;color:var(--cyan)}
        .boas-form-area{background:#fff;border-radius:20px;padding:48px;box-shadow:0 15px 50px rgba(0,0,0,0.1)}
        .boas-form-header{margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #F3F4F6}
        .boas-form-title{font-size:26px;font-weight:700;color:#000;margin-bottom:8px}
        .boas-form-subtitle{font-size:15px;color:#666}
        .boas-form-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}
        .boas-form-row-half{grid-template-columns:repeat(2,1fr)}
        .boas-form-group{display:flex;flex-direction:column}
        .boas-form-full{grid-column:1/-1}
        .boas-form-label{font-size:14px;font-weight:600;color:#333;margin-bottom:8px}
        .boas-form-label .required{color:#EF4444}
        .boas-form-input,.boas-form-select,.boas-form-textarea{width:100%;padding:14px 16px;font-size:16px;border:2px solid #E5E7EB;border-radius:8px;background:#fff;transition:all .3s ease;font-family:inherit}
        .boas-form-input:focus,.boas-form-select:focus,.boas-form-textarea:focus{outline:none;border-color:var(--cyan);box-shadow:0 0 0 3px rgba(0, 212, 216,0.1)}
        .boas-form-input::placeholder,.boas-form-textarea::placeholder{color:#9CA3AF}
        .boas-form-textarea{min-height:120px;resize:vertical}
        .boas-fund-type-group{margin-bottom:24px}
        .boas-fund-type-label{display:block;font-size:14px;font-weight:600;color:#333;margin-bottom:12px}
        .boas-fund-type-options{display:flex;flex-wrap:wrap;gap:12px}
        .boas-fund-type-option{position:relative}
        .boas-fund-type-option input[type="checkbox"]{position:absolute;opacity:0;width:0;height:0}
        .boas-fund-type-option label{display:inline-block;padding:10px 20px;font-size:14px;font-weight:500;color:#666;background:#F9FAFB;border:2px solid #E5E7EB;border-radius:8px;cursor:pointer;transition:all .2s ease}
        .boas-fund-type-option input[type="checkbox"]:checked+label{background:var(--cyan-lighter);border-color:var(--cyan);color:var(--cyan-dark);font-weight:600}
        .boas-fund-type-option label:hover{border-color:var(--cyan);background:#F3F4F6}
        .boas-privacy-section{margin-top:24px;padding:20px;background:#F9FAFB;border-radius:10px;border:1px solid #E5E7EB}
        .boas-privacy-checkbox{display:flex;align-items:center;gap:10px}
        .boas-privacy-checkbox input[type="checkbox"]{width:20px;height:20px;accent-color:var(--cyan);cursor:pointer;flex-shrink:0}
        .boas-privacy-checkbox-label{font-size:14px;font-weight:500;color:#333;cursor:pointer;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .boas-privacy-detail-link{font-size:13px;color:var(--cyan);text-decoration:underline;cursor:pointer}
        .boas-privacy-content{max-height:0;overflow:hidden;transition:max-height .3s ease,margin .3s ease,padding .3s ease}
        .boas-privacy-content.active{max-height:200px;margin-top:16px;padding-top:16px;border-top:1px solid #E5E7EB}
        .boas-privacy-content p{font-size:13px;color:#666;line-height:1.6;margin-bottom:6px}
        .boas-privacy-content p:last-child{margin-bottom:0}
        .boas-form-submit{margin-top:32px;text-align:center}
        .boas-submit-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,var(--cyan) 0%,var(--cyan-dark) 100%);color:#fff;font-size:18px;font-weight:600;padding:18px 48px;border:none;border-radius:10px;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 16px rgba(0, 212, 216,0.35);width:100%;max-width:400px;font-family:inherit}
        .boas-submit-button svg{width:22px;height:22px}
        .boas-submit-button:hover{background:linear-gradient(135deg,var(--cyan-dark) 0%,var(--cyan) 100%);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0, 212, 216,0.5)}
        .boas-submit-button:disabled{opacity:0.6;cursor:not-allowed;transform:none}
        .boas-submit-note{margin-top:12px;font-size:13px;color:#999}
        @media(max-width:1023px){
          .boas-contact-hero-container{padding:60px 32px;gap:48px;grid-template-columns:1fr 1fr}
          .boas-contact-hero-headline{font-size:40px}
          .boas-contact-hero-subheadline{font-size:16px;margin-bottom:28px}
          .boas-contact-hero-visual img{max-width:400px}
          .boas-contact-process{padding:80px 0}
          .boas-process-steps{grid-template-columns:repeat(2,1fr);gap:60px 40px}
          .boas-process-step-card::after{display:none}
          .boas-process-step-card:nth-child(odd)::after{display:block}
          .boas-process-step-card:nth-child(3)::after{display:none}
          .boas-contact-faq{padding:80px 0}
          .boas-faq-question{padding:20px 24px}
          .boas-faq-question-text{font-size:17px}
          .boas-faq-item.active .boas-faq-answer{padding:0 24px 24px}
          .boas-contact-form-section{padding:80px 0}
          .boas-form-wrapper{gap:40px}
          .boas-info-title{font-size:30px}
          .boas-info-desc{font-size:16px}
          .boas-form-area{padding:36px}
          .boas-form-row{grid-template-columns:repeat(2,1fr)}
          .boas-form-row-half{grid-template-columns:1fr}
        }
        @media(max-width:767px){
          .boas-contact-hero{min-height:auto;padding:0}
          .boas-contact-hero-container{grid-template-columns:1fr;padding:0;gap:0;text-align:center}
          .boas-contact-hero-content{max-width:100%;padding:40px 20px;order:1}
          .boas-contact-hero-headline{font-size:26px;margin-bottom:20px;line-height:1.3;word-break:keep-all}
          .boas-contact-hero-subheadline{font-size:14px;margin-bottom:32px;line-height:1.6;word-break:keep-all}
          .boas-contact-hero-disclaimer{font-size:11px;margin-top:20px;line-height:1.4}
          .boas-contact-hero-cta-group{flex-direction:column;gap:12px}
          .boas-contact-hero-cta-group .boas-cta-primary,.boas-contact-hero-cta-group .boas-cta-ghost{width:100%;justify-content:center;font-size:15px;padding:15px 20px}
          .boas-contact-hero-visual{order:-1;width:100%}
          .boas-contact-hero-visual img{max-width:100%;width:100%;aspect-ratio:4/5;border-radius:0;box-shadow:none}
          .boas-contact-process{padding:60px 0}
          .boas-process-steps{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:0;padding:0 20px;-ms-overflow-style:none;scrollbar-width:none}
          .boas-process-steps::-webkit-scrollbar{display:none}
          .boas-process-step-card{flex:0 0 85%;scroll-snap-align:center;padding:30px 20px;margin-right:16px;background:rgba(255,255,255,0.5);border-radius:16px;backdrop-filter:blur(10px);border:1px solid rgba(0, 212, 216,0.2)}
          .boas-process-step-card:last-child{margin-right:0}
          .boas-process-step-card::after{display:none !important}
          .boas-step-icon-wrap{width:80px;height:80px;margin-bottom:20px}
          .boas-step-icon-wrap svg{width:40px;height:40px}
          .boas-step-number-badge{width:28px;height:28px;font-size:13px}
          .boas-step-card-title{font-size:18px}
          .boas-step-card-desc{font-size:14px}
          .boas-contact-faq{padding:60px 0}
          .boas-faq-list{gap:12px}
          .boas-faq-question{padding:16px}
          .boas-faq-question-text{font-size:13px;padding-right:8px;word-break:keep-all}
          .boas-faq-label{width:20px;height:20px;font-size:11px;margin-right:8px}
          .boas-faq-icon{width:24px;height:24px}
          .boas-faq-icon svg{width:14px;height:14px}
          .boas-faq-item.active .boas-faq-answer{padding:0 16px 16px}
          .boas-faq-answer-text{font-size:13px;line-height:1.7}
          .boas-contact-form-section{padding:60px 0}
          .boas-form-wrapper{grid-template-columns:1fr;gap:0}
          .boas-form-info{display:none}
          .boas-form-area{padding:28px 20px;border-radius:16px}
          .boas-form-header{margin-bottom:24px;padding-bottom:20px;text-align:center}
          .boas-form-title{font-size:22px}
          .boas-form-subtitle{font-size:14px;text-wrap:balance}
          .boas-form-row{grid-template-columns:1fr;gap:16px;margin-bottom:16px}
          .boas-form-row-half{grid-template-columns:1fr}
          .boas-form-input,.boas-form-select,.boas-form-textarea{padding:12px 14px;font-size:15px}
          .boas-form-textarea{min-height:100px}
          .boas-fund-type-label{font-size:13px}
          .boas-fund-type-options{gap:8px}
          .boas-fund-type-option label{padding:8px 14px;font-size:13px}
          .boas-privacy-section{padding:16px}
          .boas-privacy-checkbox-label{font-size:13px}
          .boas-privacy-detail-link{font-size:12px}
          .boas-privacy-content p{font-size:12px}
          .boas-form-submit{margin-top:24px}
          .boas-submit-button{width:100%;max-width:none;font-size:16px;padding:16px 24px}
          .boas-submit-note{font-size:12px}
        }
      ` }} />

      {/* Hero Section */}
      <section id="boas-contact-hero" className="boas-contact-hero">
        <div className="boas-contact-hero-container">
          <div className="boas-contact-hero-content">
            <h1 className="boas-contact-hero-headline">
              무료 기업진단으로<br/>
              시작하세요
            </h1>

            <p className="boas-contact-hero-subheadline">
              정책자금부터 기업인증까지<br/>
              맞춤형 자금조달 전략을 무료로 확인하세요
            </p>

            <div className="boas-contact-hero-cta-group">
              <a href="#boas-contact-form" className="boas-cta-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                무료 심사 신청하기
              </a>

              <a href="tel:1533-9269" className="boas-cta-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                전화 문의하기
              </a>
            </div>

            <p className="boas-contact-hero-disclaimer">
              ※ 개인역량 및 성장잠재력을 분석합니다.<br/>
              정책자금 서류작성 및 접수대행을 하지 않습니다.
            </p>
          </div>

          <div className="boas-contact-hero-visual">
            <Image unoptimized src={IMAGES.contactHero} alt="보아스 경영지원솔루션 - 무료심사" width={500} height={500} priority />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="boas-contact-process">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">정책자금 상담 프로세스</h2>
            <p className="boas-section-subtitle">
              체계적인 4단계 컨설팅으로<br/>
              최적의 자금조달 전략을 제시합니다
            </p>
          </div>

          <div className="boas-process-steps">
            <div className="boas-process-step-card">
              <div className="boas-step-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span className="boas-step-number-badge">01</span>
              </div>
              <h3 className="boas-step-card-title">무료심사 신청</h3>
              <p className="boas-step-card-desc">
                온라인 또는 전화로<br/>
                간편하게 신청하세요
              </p>
            </div>

            <div className="boas-process-step-card">
              <div className="boas-step-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <span className="boas-step-number-badge">02</span>
              </div>
              <h3 className="boas-step-card-title">기업 현황 분석</h3>
              <p className="boas-step-card-desc">
                전문 컨설턴트가<br/>
                기업 역량을 면밀히 분석
              </p>
            </div>

            <div className="boas-process-step-card">
              <div className="boas-step-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <span className="boas-step-number-badge">03</span>
              </div>
              <h3 className="boas-step-card-title">자금조달 전략 수립</h3>
              <p className="boas-step-card-desc">
                상황에 최적화된<br/>
                정책자금 전략을 제시
              </p>
            </div>

            <div className="boas-process-step-card">
              <div className="boas-step-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="boas-step-number-badge">04</span>
              </div>
              <h3 className="boas-step-card-title">실행 지원</h3>
              <p className="boas-step-card-desc">
                신청부터 승인까지<br/>
                전 과정을 밀착 지원
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="boas-cta-bar">
        <div className="boas-cta-bar-container">
          <p className="boas-cta-text">
            지금 바로 <span className="highlight">무료 심사</span>를 신청하세요<br/>
            맞춤형 정책자금 전략을 확인할 수 있습니다
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="boas-contact-faq">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">정책자금 상담 자주 묻는 질문</h2>
            <p className="boas-section-subtitle">
              상담 전 궁금하신 사항을<br className="mobile-br"/>
              빠르게 확인하세요
            </p>
          </div>

          <div className="boas-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`boas-faq-item ${openFaq === i ? 'active' : ''}`}>
                <button className="boas-faq-question" onClick={() => toggleFaq(i)} aria-expanded={openFaq === i}>
                  <div className="boas-faq-question-inner">
                    <span className="boas-faq-label">Q</span>
                    <span className="boas-faq-question-text">{faq.q}</span>
                  </div>
                  <div className="boas-faq-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </button>
                <div className="boas-faq-answer">
                  <p className="boas-faq-answer-text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="boas-contact-form" className="boas-contact-form-section">
        <div className="boas-section-container">
          <div className="boas-form-wrapper">
            {/* Left: Info */}
            <div className="boas-form-info">
              <h2 className="boas-info-title">
                정책자금<br/>
                <span className="highlight">무료 상담 신청</span>
              </h2>
              <p className="boas-info-desc">
                보아스 경영지원솔루션 전문 컨설턴트가<br/>
                맞춤형 정책자금 조달 방안을<br/>
                제시해드립니다.
              </p>

              <div className="boas-info-image">
                <Image quality={90} src={IMAGES.consultantPortrait} alt="정책자금 상담" width={300} height={400} />
              </div>

              <div className="boas-contact-box">
                <div className="boas-contact-box-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span className="boas-contact-box-text"><strong>1533-9269</strong></span>
                </div>
                <div className="boas-contact-box-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span className="boas-contact-box-text">평일 09:00 ~ 18:00</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="boas-form-area">
              <div className="boas-form-header">
                <h3 className="boas-form-title">상담 신청서</h3>
                <p className="boas-form-subtitle">정보를 입력해주시면 전문가가 24시간 내 연락드립니다</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="boas-form-row">
                  <div className="boas-form-group">
                    <label htmlFor="company-name" className="boas-form-label">기업명 <span className="required">*</span></label>
                    <input type="text" id="company-name" name="company-name" className="boas-form-input" required />
                  </div>
                  <div className="boas-form-group">
                    <label htmlFor="ceo-name" className="boas-form-label">대표자명 <span className="required">*</span></label>
                    <input type="text" id="ceo-name" name="ceo-name" className="boas-form-input" required />
                  </div>
                  <div className="boas-form-group">
                    <label htmlFor="phone" className="boas-form-label">연락처 <span className="required">*</span></label>
                    <input type="tel" id="phone" name="phone" className="boas-form-input" placeholder="010-0000-0000" required />
                  </div>
                  <div className="boas-form-group">
                    <label htmlFor="consult-time" className="boas-form-label">통화 가능 시간 <span className="required">*</span></label>
                    <select id="consult-time" name="consult-time" className="boas-form-select" required>
                      <option value="">선택하세요</option>
                      <option value="09:00-10:00">오전 09:00 - 10:00</option>
                      <option value="10:00-11:00">오전 10:00 - 11:00</option>
                      <option value="11:00-12:00">오전 11:00 - 12:00</option>
                      <option value="14:00-15:00">오후 14:00 - 15:00</option>
                      <option value="15:00-16:00">오후 15:00 - 16:00</option>
                      <option value="16:00-17:00">오후 16:00 - 17:00</option>
                      <option value="17:00-18:00">오후 17:00 - 18:00</option>
                      <option value="언제나가능">언제나 가능</option>
                    </select>
                  </div>
                </div>

                <div className="boas-form-row boas-form-row-half">
                  <div className="boas-form-group">
                    <label htmlFor="amount" className="boas-form-label">필요 자금 규모</label>
                    <select id="amount" name="amount" className="boas-form-select">
                      <option value="">선택하세요</option>
                      <option value="5천만원 이하">5천만원 이하</option>
                      <option value="5천만원~1억원">5천만원 ~ 1억원</option>
                      <option value="1억원~3억원">1억원 ~ 3억원</option>
                      <option value="3억원~5억원">3억원 ~ 5억원</option>
                      <option value="5억원~10억원">5억원 ~ 10억원</option>
                      <option value="10억원 이상">10억원 이상</option>
                    </select>
                  </div>
                </div>

                <div className="boas-fund-type-group">
                  <label className="boas-fund-type-label">지원받고 싶은 자금 종류 (복수 선택 가능)</label>
                  <div className="boas-fund-type-options">
                    {['창업자금', '운전자금', '시설자금', '기타자금'].map((type, i) => (
                      <div key={i} className="boas-fund-type-option">
                        <input type="checkbox" id={`fund${i + 1}`} name="fundType" value={type} />
                        <label htmlFor={`fund${i + 1}`}>{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="boas-form-group boas-form-full">
                  <label htmlFor="message" className="boas-form-label">문의사항</label>
                  <textarea id="message" name="message" className="boas-form-textarea" placeholder="필요하신 자금의 용도나 현재 경영 상황 등을 간략히 적어주세요"></textarea>
                </div>

                <div className="boas-privacy-section">
                  <div className="boas-privacy-checkbox">
                    <input type="checkbox" id="privacy" name="privacy-agree" required />
                    <label htmlFor="privacy" className="boas-privacy-checkbox-label">
                      개인정보 수집·이용에 동의합니다 <span className="required">*</span>
                      <span className="boas-privacy-detail-link" onClick={() => setPrivacyOpen(!privacyOpen)}>내용보기</span>
                    </label>
                  </div>
                  <div className={`boas-privacy-content ${privacyOpen ? 'active' : ''}`}>
                    <p><strong>1. 수집항목:</strong> 기업명, 대표자명, 연락처, 이메일, 문의내용</p>
                    <p><strong>2. 수집목적:</strong> 정책자금 상담 및 지원 서비스 제공</p>
                    <p><strong>3. 보유기간:</strong> 서비스 종료 후 3년</p>
                    <p><strong>4.</strong> 동의 거부 시 서비스 이용이 제한될 수 있습니다.</p>
                  </div>
                </div>

                <div className="boas-form-submit">
                  <button type="submit" className="boas-submit-button" disabled={submitting}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    {submitting ? '신청 중...' : '무료 상담 신청하기'}
                  </button>
                  <p className="boas-submit-note">신청 후 24시간 내 연락드립니다</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
