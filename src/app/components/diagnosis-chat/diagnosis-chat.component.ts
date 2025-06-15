import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-diagnosis-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnosis-chat.component.html',
  styleUrls: ['./diagnosis-chat.component.css']
})
export class DiagnosisChatComponent implements OnInit {
  userMessage: string = '';
  messages: { sender: 'user' | 'bot'; text: string; isHtml?: boolean }[] = [];
  username: string | null = null;

  ngOnInit() {
    this.username = sessionStorage.getItem('displayName') || 'User';
    this.messages.push({
      sender: 'bot',
      text: this.getGreeting(),
      isHtml: true
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return `
      <div class="welcome-message">
        <h3>${greeting}, ${this.username}!</h3>
        <p>I'm your medical assistant. Please describe your symptoms or condition, and I'll provide information about possible treatments and precautions.</p>
        <p class="examples">Examples: <span>headache and fever</span>, <span>diabetes medications</span>, <span>علاج ارتفاع ضغط الدم</span></p>
      </div>
    `;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ sender: 'user', text: this.userMessage });
    const reply = this.generateBotReply(this.userMessage);
    this.messages.push({ sender: 'bot', text: reply, isHtml: true });

    this.userMessage = '';
  }

  generateBotReply(message: string): string {
    const lower = message.toLowerCase();
    const isArabic = /[\u0600-\u06FF]/.test(message);
    const detectedConditions = this.detectConditions(message);

    if (detectedConditions.length === 0) {
      return isArabic
        ? "الرجاء إدخال أعراض صحيحة مثل: صداع، حمى، سكري، ضغط، أنيميا، امساك، اسهال، انفلونزا، التهاب الحلق، ربو، كورونا."
        : "Please enter valid symptoms like: headache, fever, diabetes, hypertension, anemia, constipation, diarrhea, flu, sore throat, asthma, covid.";
    }

    if (detectedConditions.length > 1) {
      return this.generateMultiConditionResponse(detectedConditions, isArabic);
    }

    return this.generateSingleConditionResponse(detectedConditions[0], isArabic);
  }

  detectConditions(message: string): string[] {
    const lower = message.toLowerCase();
    const conditions: string[] = [];

    const conditionKeywords = [
      // English conditions
      'headache', 'migraine', 'fever', 'cough', 'cold', 'flu', 'sore throat',
      'diarrhea', 'constipation', 'nausea', 'vomiting', 'heartburn', 'gerd',
      'hypertension', 'high blood pressure', 'hypotension', 'low blood pressure',
      'diabetes', 'high blood sugar', 'hypoglycemia', 'low blood sugar',
      'asthma', 'shortness of breath', 'wheezing', 'allergy', 'rash', 'itching',
      'anemia', 'fatigue', 'weakness', 'dizziness', 'chest pain', 'palpitations',
      'depression', 'anxiety', 'insomnia', 'back pain', 'joint pain', 'arthritis',
      'uti', 'urinary infection', 'kidney stones', 'menstrual cramps', 'pms',
      'covid', 'coronavirus', 'pneumonia', 'bronchitis', 'sinusitis', 'conjunctivitis',
      
      // Arabic conditions
      'صداع', 'صداع نصفي', 'حمى', 'سعال', 'برد', 'انفلونزا', 'التهاب الحلق',
      'اسهال', 'امساك', 'غثيان', 'قيء', 'حرقة', 'ارتجاع', 'ضغط', 'ارتفاع ضغط',
      'انخفاض ضغط', 'سكري', 'ارتفاع سكر', 'انخفاض سكر', 'ربو', 'ضيق تنفس',
      'صفير', 'حساسية', 'طفح', 'حكة', 'أنيميا', 'فقر دم', 'دوخة', 'ضعف',
      'آلام صدر', 'خفقان', 'اكتئاب', 'قلق', 'أرق', 'آلام ظهر', 'آلام مفاصل',
      'التهاب مفاصل', 'عدوى بولية', 'حصوات كلوية', 'آلام الدورة', 'كورونا',
      'التهاب رئوي', 'التهاب شعبي', 'التهاب الجيوب', 'التهاب ملتحمة'
    ];

    for (const condition of conditionKeywords) {
      if (lower.includes(condition)) {
        conditions.push(condition);
      }
    }

    return [...new Set(conditions)]; // Remove duplicates
  }

  generateMultiConditionResponse(conditions: string[], isArabic: boolean): string {
    const responses: string[] = [];
    
    for (const condition of conditions) {
      const response = this.getConditionResponse(condition, isArabic);
      if (response) {
        responses.push(response);
      }
    }

    if (responses.length === 0) {
      return isArabic
        ? "عذرًا، لا أملك معلومات كافية عن هذه الأعراض المتعددة. يرجى استشارة الطبيب."
        : "Sorry, I don't have enough information about these multiple symptoms. Please consult a doctor.";
    }

    const disclaimer = isArabic
      ? `<div class="disclaimer"><b>ملاحظة:</b> هذه معلومات عامة فقط. استشر طبيبك قبل تناول أي أدوية، خاصة إذا كنت تعاني من عدة حالات أو تأخذ أدوية أخرى.</div>`
      : `<div class="disclaimer"><b>NOTE:</b> This is general information only. Consult your doctor before taking any medications, especially if you have multiple conditions or take other drugs.</div>`;

    const usernameNote = isArabic
      ? `<div class="personal-note">${this.username}، يبدو أن لديك عدة أعراض تحتاج إلى عناية خاصة.</div>`
      : `<div class="personal-note">${this.username}, it seems you have multiple symptoms that need special attention.</div>`;

    return `
      <div class="multi-condition">
        ${usernameNote}
        <h4>${isArabic ? 'العلاجات المقترحة' : 'Suggested Treatments'}</h4>
        ${responses.join('<hr>')}
        ${disclaimer}
      </div>
    `;
  }

  generateSingleConditionResponse(condition: string, isArabic: boolean): string {
    const response = this.getConditionResponse(condition, isArabic);
    
    if (!response) {
      return isArabic
        ? "عذرًا، لا أملك معلومات كافية عن هذه الحالة. يرجى استشارة الطبيب."
        : "Sorry, I don't have enough information about this condition. Please consult a doctor.";
    }

    const disclaimer = isArabic
      ? `<div class="disclaimer"><b>ملاحظة:</b> استشر طبيبك قبل تناول أي دواء، خاصة إذا كنت تعاني من أمراض مزمنة أو تأخذ أدوية أخرى.</div>`
      : `<div class="disclaimer"><b>NOTE:</b> Always consult your doctor before taking any medication, especially if you have chronic conditions or take other drugs.</div>`;

    return response + disclaimer;
  }

  getConditionResponse(condition: string, isArabic: boolean): string | null {
    const knowledgeBase: { [key: string]: { en: string; ar: string } } = {
      // Expanded knowledge base with more conditions and medications
      'headache, صداع': {
        en: `<div class="condition-response">
              <h4>HEADACHE TREATMENT</h4>
              <div class="medications">
                <h5>Common Medications:</h5>
                <ul>
                  <li><b>Paracetamol (Acetaminophen):</b> 500-1000mg every 4-6 hours (Max 4000mg/day)</li>
                  <li><b>Ibuprofen:</b> 200-400mg every 6-8 hours (Max 1200mg/day)</li>
                  <li><b>Aspirin:</b> 325-650mg every 4-6 hours (Max 4000mg/day)</li>
                  <li><b>Naproxen:</b> 220-440mg initially, then 220mg every 8-12 hours</li>
                </ul>
              </div>
              <div class="warnings">
                <h5>Warnings & Contraindications:</h5>
                <ul>
                  <li>Avoid NSAIDs (Ibuprofen, Aspirin, Naproxen) if you have:
                    <ul>
                      <li>Kidney disease</li>
                      <li>Stomach ulcers or GERD</li>
                      <li>Heart failure</li>
                      <li>Bleeding disorders</li>
                    </ul>
                  </li>
                  <li>Avoid Aspirin in children under 16 (Reye's syndrome risk)</li>
                </ul>
              </div>
              <div class="advice">
                <h5>Self-Care Advice:</h5>
                <ul>
                  <li>Rest in a dark, quiet room</li>
                  <li>Apply cold compress to forehead</li>
                  <li>Stay hydrated (drink water)</li>
                  <li>Practice relaxation techniques</li>
                  <li>Maintain regular sleep schedule</li>
                </ul>
              </div>
            </div>`,
        ar: `<div class="condition-response">
              <h4>علاج الصداع</h4>
              <div class="medications">
                <h5>الأدوية الشائعة:</h5>
                <ul>
                  <li><b>باراسيتامول:</b> 500-1000 مجم كل 4-6 ساعات (الحد الأقصى 4000 مجم/يوم)</li>
                  <li><b>ايبوبروفين:</b> 200-400 مجم كل 6-8 ساعات (الحد الأقصى 1200 مجم/يوم)</li>
                  <li><b>أسبرين:</b> 325-650 مجم كل 4-6 ساعات (الحد الأقصى 4000 مجم/يوم)</li>
                  <li><b>نابروكسين:</b> 220-440 مجم جرعة أولية، ثم 220 مجم كل 8-12 ساعة</li>
                </ul>
              </div>
              <div class="warnings">
                <h5>تحذيرات وموانع الاستعمال:</h5>
                <ul>
                  <li>تجنب مضادات الالتهاب (ايبوبروفين، أسبرين، نابروكسين) إذا كنت تعاني من:
                    <ul>
                      <li>أمراض الكلى</li>
                      <li>قرحة المعدة أو ارتجاع المريء</li>
                      <li>فشل القلب</li>
                      <li>اضطرابات النزيف</li>
                    </ul>
                  </li>
                  <li>تجنب الأسبرين للأطفال تحت 16 سنة (خطر متلازمة راي)</li>
                </ul>
              </div>
              <div class="advice">
                <h5>نصائح للعناية الذاتية:</h5>
                <ul>
                  <li>الراحة في غرفة مظلمة وهادئة</li>
                  <li>ضع كمادات باردة على الجبهة</li>
                  <li>اشرب كميات كافية من الماء</li>
                  <li>مارس تمارين الاسترخاء</li>
                  <li>حافظ على جدول نوم منتظم</li>
                </ul>
              </div>
            </div>`
      },
      'fever, حمى': {
        en: `<div class="condition-response">
              <h4>FEVER MANAGEMENT</h4>
              <div class="medications">
                <h5>Common Medications:</h5>
                <ul>
                  <li><b>Paracetamol (Acetaminophen):</b> 500-1000mg every 4-6 hours (Max 4000mg/day)</li>
                  <li><b>Ibuprofen:</b> 200-400mg every 6-8 hours (Max 1200mg/day)</li>
                </ul>
              </div>
              <div class="warnings">
                <h5>Warnings & Contraindications:</h5>
                <ul>
                  <li>Avoid NSAIDs (Ibuprofen) if you have:
                    <ul>
                      <li>Kidney disease</li>
                      <li>Stomach ulcers or GERD</li>
                      <li>Heart failure</li>
                      <li>Bleeding disorders</li>
                    </ul>
                  </li>
                  <li>Avoid Aspirin in children under 16 (Reye's syndrome risk)</li>
                </ul>
              </div>
              <div class="advice">
                <h5>Self-Care Advice:</h5>
                <ul>
                  <li>Stay hydrated (drink plenty of fluids)</li>
                  <li>Rest and avoid strenuous activities</li>
                  <li>Wear light clothing to help cool down</li>
                  <li>Monitor temperature regularly</li>
                </ul>
              </div>
            </div>`,
        ar: `<div class="condition-response">
              <h4>إدارة الحمى</h4>
              <div class="medications">
                <h5>الأدوية الشائعة:</h5>
                <ul>
                  <li><b>باراسيتامول:</b> 500-1000 مجم كل 4-6 ساعات (الحد الأقصى 4000 مجم/يوم)</li>
                  <li><b>ايبوبروفين:</b> 200-400 مجم كل 6-8 ساعات (الحد الأقصى 1200 مجم/يوم)</li>
                </ul>
              </div>
              <div class="warnings">
                <h5>تحذيرات وموانع الاستعمال:</h5>
                <ul>
                  <li>تجنب مضادات الالتهاب (ايبوبروفين) إذا كنت تعاني من:
                    <ul>
                      <li>أمراض الكلى</li>
                      <li>قرحة المعدة أو ارتجاع المريء</li>
                      <li>فشل القلب</li>
                      <li>اضطرابات النزيف</li>
                    </ul>
                  </li>
                  <li>تجنب الأسبرين للأطفال تحت 16 سنة (خطر متلازمة راي)</li>
                </ul>
              </div>
              <div class="advice">
                <h5>نصائح للعناية الذاتية:</h5>
                <ul>
                  <li>اشرب الكثير من السوائل</li>
                  <li>الراحة وتجنب الأنشطة المجهدة</li>
                  <li>ارتدِ ملابس خفيفة للمساعدة في التبريد</li>
                  <li>راقب درجة الحرارة بانتظام</li>
                </ul>
              </div>
            </div>`
      },
      'diabetes, سكري, سكر': {
        en: `<div class="condition-response">
              <h4>DIABETES MANAGEMENT</h4>
              <div class="medications">
                <h5>Common Medications:</h5>
                <ul>
                  <li><b>Metformin:</b> 500-1000mg twice daily (First-line treatment)</li>
                  <li><b>Gliclazide:</b> 40-320mg daily (Stimulates insulin secretion)</li>
                  <li><b>Insulin therapy:</b> Various types (Rapid, short, intermediate, long-acting)</li>
                  <li><b>Empagliflozin:</b> 10-25mg daily (SGLT2 inhibitor)</li>
                  <li><b>Liraglutide:</b> 0.6-1.8mg daily (GLP-1 receptor agonist)</li>
                </ul>
              </div>
              <div class="warnings">
                <h5>Important Warnings:</h5>
                <ul>
                  <li>Metformin contraindicated in:
                    <ul>
                      <li>Severe kidney impairment (eGFR <30)</li>
                      <li>Liver disease</li>
                      <li>Conditions causing tissue hypoxia</li>
                    </ul>
                  </li>
                  <li>Sulfonylureas (Gliclazide) can cause hypoglycemia</li>
                  <li>Monitor for symptoms of ketoacidosis with SGLT2 inhibitors</li>
                </ul>
              </div>
              <div class="advice">
                <h5>Lifestyle Advice:</h5>
                <ul>
                  <li>Monitor blood sugar regularly</li>
                  <li>Follow a balanced, low-glycemic diet</li>
                  <li>Exercise regularly (150 mins/week)</li>
                  <li>Regular foot care and inspections</li>
                  <li>Carry glucose tablets for hypoglycemia</li>
                </ul>
              </div>
            </div>`,
        ar: `<div class="condition-response">
              <h4>إدارة مرض السكري</h4>
              <div class="medications">
                <h5>الأدوية الشائعة:</h5>
                <ul>
                  <li><b>ميتفورمين:</b> 500-1000 مجم مرتين يوميًا (العلاج الأولي)</li>
                  <li><b>جليكلازيد:</b> 40-320 مجم يوميًا (يحفز إفراز الأنسولين)</li>
                  <li><b>العلاج بالأنسولين:</b> أنواع مختلفة (سريع، قصير، متوسط، طويل المفعول)</li>
                  <li><b>إمباجليفلوزين:</b> 10-25 مجم يوميًا (مثبط SGLT2)</li>
                  <li><b>ليراجلوتايد:</b> 0.6-1.8 مجم يوميًا (ناهض مستقبلات GLP-1)</li>
                </ul>
              </div>
              <div class="warnings">
                <h5>تحذيرات هامة:</h5>
                <ul>
                  <li>يمنع استخدام ميتفورمين في:
                    <ul>
                      <li>القصور الكلوي الشديد (eGFR <30)</li>
                      <li>أمراض الكبد</li>
                      <li>الحالات التي تسبب نقص الأكسجة</li>
                    </ul>
                  </li>
                  <li>أدوية السلفونيل يوريا (جليكلازيد) قد تسبب انخفاض السكر</li>
                  <li>مراقبة أعراض الحماض الكيتوني مع مثبطات SGLT2</li>
                </ul>
              </div>
              <div class="advice">
                <h5>نصائح لنمط الحياة:</h5>
                <ul>
                  <li>مراقبة مستوى السكر بانتظام</li>
                  <li>اتباع نظام غذائي متوازن منخفض المؤشر الجلايسيمي</li>
                  <li>ممارسة الرياضة بانتظام (150 دقيقة/أسبوع)</li>
                  <li>العناية بالقدمين وفحصها بانتظام</li>
                  <li>احمل أقراص الجلوكوز لعلاج انخفاض السكر</li>
                </ul>
              </div>
            </div>`
      },
      // Continue with all other conditions...
      'cough, سعال': {
      en: `<div class="condition-response">
            <h4>COUGH TREATMENT</h4>
            <div class="medications">
              <h5>Common Medications:</h5>
              <ul>
                <li><b>Dextromethorphan:</b> 10-30mg every 4-8 hours (Max 120mg/day)</li>
                <li><b>Guaifenesin:</b> 200-400mg every 4 hours (Max 2400mg/day)</li>
                <li><b>Codeine:</b> 10-20mg every 4-6 hours (Prescription only)</li>
                <li><b>Antihistamines:</b> For allergic cough (e.g., Loratadine, Cetirizine)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Avoid cough suppressants for productive cough</li>
                <li>Codeine is contraindicated in children under 12</li>
                <li>Seek medical attention if cough persists >3 weeks</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Stay hydrated</li>
                <li>Use honey (not for infants under 1)</li>
                <li>Humidify the air</li>
                <li>Avoid irritants (smoke, dust)</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>علاج السعال</h4>
            <div class="medications">
              <h5>الأدوية الشائعة:</h5>
              <ul>
                <li><b>ديكستروميثورفان:</b> 10-30 مجم كل 4-8 ساعات (الحد الأقصى 120 مجم/يوم)</li>
                <li><b>جوايفينيسين:</b> 200-400 مجم كل 4 ساعات (الحد الأقصى 2400 مجم/يوم)</li>
                <li><b>كودايين:</b> 10-20 مجم كل 4-6 ساعات (بوصفة طبية فقط)</li>
                <li><b>مضادات الهيستامين:</b> للسعال التحسسي (لوراتادين، سيتريزين)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>تجنب مثبطات السعال للسعال المنتج للبلغم</li>
                <li>يمنع استخدام الكودايين للأطفال تحت 12 سنة</li>
                <li>استشر الطبيب إذا استمر السعال أكثر من 3 أسابيع</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>اشرب السوائل بكثرة</li>
                <li>استخدم العسل (ممنوع للرضع تحت سنة)</li>
                <li>استخدم مرطب الهواء</li>
                <li>تجنب المهيجات (الدخان، الغبار)</li>
              </ul>
            </div>
          </div>`
    },
    'asthma, ربو': {
      en: `<div class="condition-response">
            <h4>ASTHMA MANAGEMENT</h4>
            <div class="medications">
              <h5>Common Medications:</h5>
              <ul>
                <li><b>Salbutamol inhaler:</b> 1-2 puffs every 4-6 hours as needed</li>
                <li><b>Beclomethasone inhaler:</b> 1-2 puffs twice daily</li>
                <li><b>Montelukast:</b> 10mg tablet daily (for allergic asthma)</li>
                <li><b>Prednisone:</b> 20-50mg daily for acute attacks (short-term)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Rinse mouth after steroid inhalers to prevent thrush</li>
                <li>Seek emergency care if symptoms worsen despite medication</li>
                <li>Avoid triggers (dust, smoke, pollen)</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Use spacer with inhalers</li>
                <li>Monitor peak flow regularly</li>
                <li>Have an action plan for attacks</li>
                <li>Get annual flu vaccine</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>إدارة الربو</h4>
            <div class="medications">
              <h5>الأدوية الشائعة:</h5>
              <ul>
                <li><b>بخاخ السالبوتامول:</b> 1-2 بخة كل 4-6 ساعات حسب الحاجة</li>
                <li><b>بخاخ البيكلوميثازون:</b> 1-2 بخة مرتين يوميًا</li>
                <li><b>مونتيلوكاست:</b> 10 مجم قرص يوميًا (للربو التحسسي)</li>
                <li><b>بريدنيزون:</b> 20-50 مجم يوميًا للنوبات الحادة (قصير المدى)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>اشطف فمك بعد استخدام البخاخات الستيرويدية لمنع العدوى الفطرية</li>
                <li>اطلب الرعاية الطارئة إذا تفاقمت الأعراض رغم الدواء</li>
                <li>تجنب المحفزات (الغبار، الدخان، حبوب اللقاح)</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>استخدم spacer مع البخاخات</li>
                <li>راقب ذروة التدفق بانتظام</li>
                <li>ضع خطة عمل للنوبات</li>
                <li>احصل على لقاح الإنفلونزا السنوي</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض الجهاز الهضمي
    'diarrhea, إسهال': {
      en: `<div class="condition-response">
            <h4>DIARRHEA TREATMENT</h4>
            <div class="medications">
              <h5>Common Medications:</h5>
              <ul>
                <li><b>Loperamide:</b> 4mg initially, then 2mg after each loose stool (Max 16mg/day)</li>
                <li><b>Oral rehydration salts:</b> As directed to prevent dehydration</li>
                <li><b>Bismuth subsalicylate:</b> 524mg every 30-60 minutes as needed</li>
                <li><b>Probiotics:</b> Saccharomyces boulardii or Lactobacillus strains</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Avoid loperamide in bloody diarrhea or fever</li>
                <li>Seek medical help if diarrhea lasts >2 days</li>
                <li>Watch for signs of dehydration</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>BRAT diet (Bananas, Rice, Applesauce, Toast)</li>
                <li>Avoid dairy, fatty foods, caffeine</li>
                <li>Wash hands frequently</li>
                <li>Disinfect contaminated surfaces</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>علاج الإسهال</h4>
            <div class="medications">
              <h5>الأدوية الشائعة:</h5>
              <ul>
                <li><b>لوبيراميد:</b> 4 مجم جرعة أولية، ثم 2 مجم بعد كل براز سائل (الحد الأقصى 16 مجم/يوم)</li>
                <li><b>أملاح الإماهة الفموية:</b> حسب التوجيهات لمنع الجفاف</li>
                <li><b>بسموث سبساليسيلات:</b> 524 مجم كل 30-60 دقيقة حسب الحاجة</li>
                <li><b>البروبيوتيك:</b> سكارومايسس بولاردي أو سلالات لاكتوباسيلوس</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>تجنب اللوبيراميد في الإسهال الدموي أو مع الحمى</li>
                <li>استشر الطبيب إذا استمر الإسهال أكثر من يومين</li>
                <li>راقب علامات الجفاف</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>نظام BRAT الغذائي (موز، أرز، صلصة تفاح، توست)</li>
                <li>تجنب الألبان، الأطعمة الدهنية، الكافيين</li>
                <li>اغسل يديك frequently</li>
                <li>عقم الأسطح الملوثة</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض الجلد
    'eczema, إكزيما': {
      en: `<div class="condition-response">
            <h4>ECZEMA MANAGEMENT</h4>
            <div class="medications">
              <h5>Common Treatments:</h5>
              <ul>
                <li><b>Hydrocortisone cream 1%:</b> Apply thinly twice daily</li>
                <li><b>Moisturizers:</b> Fragrance-free creams (Cerave, Eucerin)</li>
                <li><b>Antihistamines:</b> For itching (e.g., Cetirizine 10mg daily)</li>
                <li><b>Tacrolimus ointment:</b> For resistant cases</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Don't use strong steroids on face or genitals</li>
                <li>Avoid scratching to prevent infection</li>
                <li>Watch for signs of skin infection</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Use lukewarm water for bathing</li>
                <li>Apply moisturizer within 3 minutes after bathing</li>
                <li>Wear cotton clothing</li>
                <li>Use fragrance-free detergents</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>إدارة الإكزيما</h4>
            <div class="medications">
              <h5>العلاجات الشائعة:</h5>
              <ul>
                <li><b>كريم هيدروكورتيزون 1%:</b> ضع طبقة رقيقة مرتين يوميًا</li>
                <li><b>المرطبات:</b> كريمات خالية من العطور (سيراف، يوسيرين)</li>
                <li><b>مضادات الهيستامين:</b> للحكة (سيتريزين 10 مجم يوميًا)</li>
                <li><b>مرهم تاكروليموس:</b> للحالات المقاومة</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>لا تستخدم الستيرويدات القوية على الوجه أو الأعضاء التناسلية</li>
                <li>تجنب الحك لمنع العدوى</li>
                <li>راقب علامات عدوى الجلد</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>استخدم ماء فاترا للاستحمام</li>
                <li>ضع المرطب خلال 3 دقائق بعد الاستحمام</li>
                <li>ارتدِ ملابس قطنية</li>
                <li>استخدم منظفات خالية من العطور</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض العيون
    'conjunctivitis, التهاب الملتحمة': {
      en: `<div class="condition-response">
            <h4>CONJUNCTIVITIS TREATMENT</h4>
            <div class="medications">
              <h5>Common Treatments:</h5>
              <ul>
                <li><b>Antibiotic drops:</b> For bacterial cases (e.g., Chloramphenicol)</li>
                <li><b>Antihistamine drops:</b> For allergic cases (e.g., Ketotifen)</li>
                <li><b>Artificial tears:</b> For viral or irritant cases</li>
                <li><b>Cold compresses:</b> To relieve discomfort</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Don't share towels or pillows</li>
                <li>Avoid wearing contact lenses</li>
                <li>Seek help if vision is affected</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Wash hands frequently</li>
                <li>Clean eyelids with sterile wipes</li>
                <li>Avoid rubbing eyes</li>
                <li>Discard eye makeup after infection</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>علاج التهاب الملتحمة</h4>
            <div class="medications">
              <h5>العلاجات الشائعة:</h5>
              <ul>
                <li><b>قطرات مضاد حيوي:</b> للحالات البكتيرية (كلورامفينيكول)</li>
                <li><b>قطرات مضاد الهيستامين:</b> للحالات التحسسية (كيتوتيفين)</li>
                <li><b>الدموع الاصطناعية:</b> للحالات الفيروسية أو المهيجة</li>
                <li><b>كمادات باردة:</b> لتخفيف الانزعاج</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>لا تشارك المناشف أو الوسائد</li>
                <li>تجنب ارتداء العدسات اللاصقة</li>
                <li>استشر الطبيب إذا تأثرت الرؤية</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>اغسل يديك frequently</li>
                <li>نظف الجفون بمناديل معقمة</li>
                <li>تجنب فرك العينين</li>
                <li>تخلص من مكياج العيون بعد العدوى</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض المسالك البولية
    'uti, urinary tract infection, التهاب المسالك البولية': {
      en: `<div class="condition-response">
            <h4>URINARY TRACT INFECTION TREATMENT</h4>
            <div class="medications">
              <h5>Common Antibiotics:</h5>
              <ul>
                <li><b>Nitrofurantoin:</b> 100mg twice daily for 5 days</li>
                <li><b>Trimethoprim-sulfamethoxazole:</b> 1 DS tablet twice daily for 3 days</li>
                <li><b>Fosfomycin:</b> 3g single dose</li>
                <li><b>Ciprofloxacin:</b> 250mg twice daily for 3 days (resistant cases)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Complete full course of antibiotics</li>
                <li>Seek help for fever, flank pain, or pregnancy</li>
                <li>Drink plenty of fluids</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Prevention:</h5>
              <ul>
                <li>Wipe front to back</li>
                <li>Urinate after intercourse</li>
                <li>Stay hydrated</li>
                <li>Avoid irritating feminine products</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>علاج التهاب المسالك البولية</h4>
            <div class="medications">
              <h5>المضادات الحيوية الشائعة:</h5>
              <ul>
                <li><b>نتروفورانتوين:</b> 100 مجم مرتين يوميًا لمدة 5 أيام</li>
                <li><b>تريميثوبريم-سلفاميثوكسازول:</b> قرص DS واحد مرتين يوميًا لمدة 3 أيام</li>
                <li><b>فوسفوميسين:</b> 3 جم جرعة واحدة</li>
                <li><b>سيبروفلوكساسين:</b> 250 مجم مرتين يوميًا لمدة 3 أيام (الحالات المقاومة)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>أكمل الجرعة الكاملة من المضاد الحيوي</li>
                <li>اطلب المساعدة عند وجود حمى، ألم في الخاصرة، أو أثناء الحمل</li>
                <li>اشرب الكثير من السوائل</li>
              </ul>
            </div>
            <div class="advice">
              <h5>الوقاية:</h5>
              <ul>
                <li>امسح من الأمام إلى الخلف</li>
                <li>تبول بعد الجماع</li>
                <li>حافظ على رطوبة الجسم</li>
                <li>تجنب منتجات النظافة النسائية المهيجة</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض النساء
    'pms, متلازمة ما قبل الحيض': {
      en: `<div class="condition-response">
            <h4>PMS MANAGEMENT</h4>
            <div class="medications">
              <h5>Common Treatments:</h5>
              <ul>
                <li><b>NSAIDs:</b> Ibuprofen 400mg every 6-8 hours</li>
                <li><b>Oral contraceptives:</b> For hormonal regulation</li>
                <li><b>Calcium supplements:</b> 1200mg daily</li>
                <li><b>SSRIs:</b> For severe mood symptoms (e.g., Fluoxetine 20mg daily)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Avoid excessive salt and caffeine</li>
                <li>Consider PMDD if symptoms are severe</li>
                <li>Rule out other conditions</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Regular exercise</li>
                <li>Balanced diet</li>
                <li>Stress management</li>
                <li>Track symptoms in a diary</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>إدارة متلازمة ما قبل الحيض</h4>
            <div class="medications">
              <h5>العلاجات الشائعة:</h5>
              <ul>
                <li><b>مضادات الالتهاب:</b> ايبوبروفين 400 مجم كل 6-8 ساعات</li>
                <li><b>حبوب منع الحمل:</b> لتنظيم الهرمونات</li>
                <li><b>مكملات الكالسيوم:</b> 1200 مجم يوميًا</li>
                <li><b>مثبطات استرداد السيروتونين:</b> لأعراض المزاج الشديدة (فلوكسيتين 20 مجم يوميًا)</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>تجنب الملح والكافيين الزائد</li>
                <li>فكر في اضطراب ما قبل الحيض المزعج إذا كانت الأعراض شديدة</li>
                <li>استبعد الحالات الأخرى</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>ممارسة الرياضة بانتظام</li>
                <li>نظام غذائي متوازن</li>
                <li>إدارة الإجهاد</li>
                <li>سجل الأعراض في مفكرة</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض العظام والمفاصل
    'arthritis, التهاب المفاصل': {
      en: `<div class="condition-response">
            <h4>ARTHRITIS MANAGEMENT</h4>
            <div class="medications">
              <h5>Common Treatments:</h5>
              <ul>
                <li><b>NSAIDs:</b> Ibuprofen 400-800mg every 6-8 hours</li>
                <li><b>Acetaminophen:</b> 500-1000mg every 6 hours</li>
                <li><b>DMARDs:</b> For rheumatoid arthritis (e.g., Methotrexate)</li>
                <li><b>Topical creams:</b> Capsaicin or NSAID gels</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Long-term NSAID use requires stomach protection</li>
                <li>Monitor for gastrointestinal bleeding</li>
                <li>Regular blood tests needed with DMARDs</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Low-impact exercise (swimming, cycling)</li>
                <li>Weight management</li>
                <li>Heat/cold therapy</li>
                <li>Assistive devices if needed</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>إدارة التهاب المفاصل</h4>
            <div class="medications">
              <h5>العلاجات الشائعة:</h5>
              <ul>
                <li><b>مضادات الالتهاب:</b> ايبوبروفين 400-800 مجم كل 6-8 ساعات</li>
                <li><b>باراسيتامول:</b> 500-1000 مجم كل 6 ساعات</li>
                <li><b>الأدوية المضادة للروماتيزم:</b> لالتهاب المفاصل الروماتويدي (ميثوتريكسات)</li>
                <li><b>كريمات موضعية:</b> كبسايسين أو جل مضاد للالتهاب</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>الاستخدام طويل الأمد لمضادات الالتهاب يتطلب حماية للمعدة</li>
                <li>راقب نزيف الجهاز الهضمي</li>
                <li>تحاليل دم دورية مطلوبة مع الأدوية المضادة للروماتيزم</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>تمارين منخفضة التأثير (سباحة، ركوب دراجات)</li>
                <li>إدارة الوزن</li>
                <li>العلاج بالحرارة/البرودة</li>
                <li>أدوات مساعدة إذا لزم الأمر</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض القلب والأوعية الدموية
    'hypertension, high blood pressure, ارتفاع ضغط الدم': {
      en: `<div class="condition-response">
            <h4>HYPERTENSION MANAGEMENT</h4>
            <div class="medications">
              <h5>Common Medications:</h5>
              <ul>
                <li><b>ACE inhibitors:</b> Lisinopril 5-40mg daily</li>
                <li><b>ARBs:</b> Losartan 25-100mg daily</li>
                <li><b>Calcium channel blockers:</b> Amlodipine 5-10mg daily</li>
                <li><b>Diuretics:</b> Hydrochlorothiazide 12.5-25mg daily</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Regular BP monitoring required</li>
                <li>Don't stop medications abruptly</li>
                <li>Watch for side effects (cough with ACE inhibitors)</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Lifestyle Changes:</h5>
              <ul>
                <li>Reduce salt intake</li>
                <li>Regular exercise</li>
                <li>Weight management</li>
                <li>Limit alcohol</li>
                <li>Stress reduction</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>إدارة ارتفاع ضغط الدم</h4>
            <div class="medications">
              <h5>الأدوية الشائعة:</h5>
              <ul>
                <li><b>مثبطات الإنزيم المحول للأنجيوتنسين:</b> ليسينوبريل 5-40 مجم يوميًا</li>
                <li><b>حاصرات مستقبلات الأنجيوتنسين:</b> لوسارتان 25-100 مجم يوميًا</li>
                <li><b>حاصرات قنوات الكالسيوم:</b> أملوديبين 5-10 مجم يوميًا</li>
                <li><b>مدرات البول:</b> هيدروكلوروثيازيد 12.5-25 مجم يوميًا</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>مطلوب مراقبة منتظمة لضغط الدم</li>
                <li>لا تتوقف عن الأدوية فجأة</li>
                <li>راقب الآثار الجانبية (السعال مع مثبطات الإنزيم المحول للأنجيوتنسين)</li>
              </ul>
            </div>
            <div class="advice">
              <h5>تغييرات نمط الحياة:</h5>
              <ul>
                <li>قلل من تناول الملح</li>
                <li>ممارسة الرياضة بانتظام</li>
                <li>إدارة الوزن</li>
                <li>حد من الكحول</li>
                <li>تقليل التوتر</li>
              </ul>
            </div>
          </div>`
    },

    // الاضطرابات النفسية
    'depression, اكتئاب': {
      en: `<div class="condition-response">
            <h4>DEPRESSION TREATMENT</h4>
            <div class="medications">
              <h5>Common Medications:</h5>
              <ul>
                <li><b>SSRIs:</b> Fluoxetine 20-80mg daily, Sertraline 50-200mg daily</li>
                <li><b>SNRIs:</b> Venlafaxine 75-225mg daily, Duloxetine 60-120mg daily</li>
                <li><b>Atypical antidepressants:</b> Bupropion 150-450mg daily</li>
                <li><b>Cognitive behavioral therapy:</b> First-line for mild cases</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Antidepressants may take 4-6 weeks to work</li>
                <li>Don't stop abruptly (taper slowly)</li>
                <li>Monitor for suicidal thoughts initially</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Regular sleep schedule</li>
                <li>Social support</li>
                <li>Physical activity</li>
                <li>Mindfulness techniques</li>
                <li>Light therapy for seasonal depression</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>علاج الاكتئاب</h4>
            <div class="medications">
              <h5>الأدوية الشائعة:</h5>
              <ul>
                <li><b>مثبطات استرداد السيروتونين:</b> فلوكسيتين 20-80 مجم يوميًا، سيرترالين 50-200 مجم يوميًا</li>
                <li><b>مثبطات استرداد السيروتونين والنورابينفرين:</b> فينلافاكسين 75-225 مجم يوميًا، دولوكستين 60-120 مجم يوميًا</li>
                <li><b>مضادات الاكتئاب غير النمطية:</b> بوبروبيون 150-450 مجم يوميًا</li>
                <li><b>العلاج السلوكي المعرفي:</b> الخط الأول للحالات الخفيفة</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>قد تستغرق مضادات الاكتئاب 4-6 أسابيع لتعمل</li>
                <li>لا تتوقف فجأة (قلل الجرعة تدريجيًا)</li>
                <li>راقب الأفكار الانتحارية في البداية</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>جدول نوم منتظم</li>
                <li>الدعم الاجتماعي</li>
                <li>النشاط البدني</li>
                <li>تقنيات اليقظة</li>
                <li>العلاج بالضوء للاكتئاب الموسمي</li>
              </ul>
            </div>
          </div>`
    },

    // أمراض الغدد الصماء
    'hypothyroidism, قصور الغدة الدرقية': {
      en: `<div class="condition-response">
            <h4>HYPOTHYROIDISM TREATMENT</h4>
            <div class="medications">
              <h5>Common Medications:</h5>
              <ul>
                <li><b>Levothyroxine:</b> 25-200mcg daily (dose based on TSH levels)</li>
                <li><b>Take on empty stomach:</b> 30-60 minutes before breakfast</li>
                <li><b>Avoid interactions:</b> Calcium, iron, PPIs, soy</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>Warnings:</h5>
              <ul>
                <li>Don't adjust dose without doctor's advice</li>
                <li>Regular TSH monitoring required</li>
                <li>Watch for symptoms of over-treatment</li>
              </ul>
            </div>
            <div class="advice">
              <h5>Self-Care:</h5>
              <ul>
                <li>Consistent medication timing</li>
                <li>Balanced diet with adequate iodine</li>
                <li>Regular follow-ups</li>
                <li>Monitor for symptom changes</li>
              </ul>
            </div>
          </div>`,
      ar: `<div class="condition-response">
            <h4>علاج قصور الغدة الدرقية</h4>
            <div class="medications">
              <h5>الأدوية الشائعة:</h5>
              <ul>
                <li><b>ليفوثيروكسين:</b> 25-200 ميكروجرام يوميًا (الجرعة حسب مستوى TSH)</li>
                <li><b>تناول على معدة فارغة:</b> 30-60 دقيقة قبل الإفطار</li>
                <li><b>تجنب التفاعلات:</b> الكالسيوم، الحديد، مثبطات مضخة البروتون، الصويا</li>
              </ul>
            </div>
            <div class="warnings">
              <h5>تحذيرات:</h5>
              <ul>
                <li>لا تعدل الجرعة دون استشارة الطبيب</li>
                <li>مطلوب مراقبة TSH بانتظام</li>
                <li>راقب أعراض العلاج الزائد</li>
              </ul>
            </div>
            <div class="advice">
              <h5>العناية الذاتية:</h5>
              <ul>
                <li>مواعيد ثابتة للدواء</li>
                <li>نظام غذائي متوازن مع اليود الكافي</li>
                <li>متابعة منتظمة</li>
                <li>راقب تغيرات الأعراض</li>
              </ul>
            </div>
          </div>`
    }
  };

      // Make sure to include all your original conditions with expanded details
    

    for (const key in knowledgeBase) {
      const keywords = key.split(',').map(k => k.trim());
      if (keywords.some(k => k.toLowerCase() === condition.toLowerCase())) {
        return isArabic ? knowledgeBase[key].ar : knowledgeBase[key].en;
      }
    }

    return null;
  }
}