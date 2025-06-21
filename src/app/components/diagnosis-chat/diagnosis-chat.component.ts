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
    console.log('Original message:', message);
    const lower = message.toLowerCase();
    const isArabic = /[\u0600-\u06FF]/.test(message);
    const detectedConditions = this.detectConditions(message);
    console.log('Detected conditions:', detectedConditions);


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

    //     const conditionKeywords = [
    //   // English conditions
    //   'headache', 'migraine', 'fever', 'cough', 'cold', 'flu', 'sore throat',
    //   'diarrhea', 'constipation', 'nausea', 'vomiting', 'heartburn', 'gerd',
    //   'hypertension', 'high blood pressure', 'hypotension', 'low blood pressure',
    //   'diabetes', 'high blood sugar', 'hypoglycemia', 'low blood sugar',
    //   'asthma', 'shortness of breath', 'wheezing', 'allergy', 'rash', 'itching',
    //   'anemia', 'fatigue', 'weakness', 'dizziness', 'chest pain', 'palpitations',
    //   'depression', 'anxiety', 'insomnia', 'back pain', 'joint pain', 'arthritis',
    //   'uti', 'urinary infection', 'kidney stones', 'menstrual cramps', 'pms',
    //   'covid', 'coronavirus', 'pneumonia', 'bronchitis', 'sinusitis', 'conjunctivitis',
    //   'eczema', 'acne', 'allergic rhinitis', 'hay fever', 'hypothyroidism', 
    //   'gastritis', 'indigestion', 'earache', 'tinnitus', 'vertigo', 'head injury',
    //   'sprain', 'strain', 'fracture', 'burn', 'sunburn', 'food poisoning',
    //   'dehydration', 'heat stroke', 'hypothermia', 'anxiety attack', 'panic attack',
    //   'psoriasis', 'hives', 'shingles', 'cold sore', 'athlete foot', 'ringworm',
    //   'yeast infection', 'bacterial vaginosis', 'erectile dysfunction', 'premature ejaculation',
    //   'pcos', 'endometriosis', 'menopause', 'hot flashes', 'osteoporosis', 'carpal tunnel',

    //   // Arabic conditions
    //   'صداع', 'صداع نصفي', 'حمى', 'سعال', 'برد', 'انفلونزا', 'التهاب الحلق',
    //   'اسهال', 'امساك', 'غثيان', 'قيء', 'حرقة', 'ارتجاع', 'ضغط', 'ارتفاع ضغط',
    //   'انخفاض ضغط', 'سكري', 'ارتفاع سكر', 'انخفاض سكر', 'ربو', 'ضيق تنفس',
    //   'صفير', 'حساسية', 'طفح', 'حكة', 'أنيميا', 'فقر دم', 'دوخة', 'ضعف',
    //   'آلام صدر', 'خفقان', 'اكتئاب', 'قلق', 'أرق', 'آلام ظهر', 'آلام مفاصل',
    //   'التهاب مفاصل', 'عدوى بولية', 'حصوات كلوية', 'آلام الدورة', 'كورونا',
    //   'حب الشباب', 'التهاب رئوي', 'التهاب شعبي', 'التهاب الجيوب', 'التهاب ملتحمة',
    //   'إكزيما', 'حساسية الأنف', 'حمى القش', 'قصور الغدة الدرقية', 'التهاب المعدة',
    //   'عسر هضم', 'ألم أذن', 'طنين', 'دوار', 'إصابة رأس', 'التواء', 'شد عضلي',
    //   'كسر', 'حروق', 'حروق شمس', 'تسمم غذائي', 'جفاف', 'ضربة شمس', 'انخفاض حرارة',
    //   'نوبة قلق', 'نوبة هلع', 'صدفية', 'شرى', 'هربس نطاقي', 'هربس فموي', 'قدم الرياضي',
    //   'سعفة', 'عدوى فطرية', 'التهاب مهبلي بكتيري', 'ضعف انتصاب', 'قذف مبكر',
    //   'ارق','تكيس المبايض', 'بطانة رحم مهاجرة', 'سن اليأس', 'هبات ساخنة', 'هشاشة عظام', 'متلازمة النفق الرسغي'
    // ];
    const conditionKeywords = [
      'headache', 'صداع',
      'fever', 'حمى',
      'diabetes', 'سكري', 'سكر',
      'cough', 'سعال',
      'asthma', 'ربو',
      'diarrhea', 'إسهال',
      'eczema', 'إكزيما',
      'conjunctivitis', 'التهاب الملتحمة',
      'uti', 'urinary tract infection', 'التهاب المسالك البولية',
      'pms', 'متلازمة ما قبل الحيض',
      'arthritis', 'التهاب المفاصل',
      'hypertension', 'high blood pressure', 'ارتفاع ضغط الدم',
      'depression', 'اكتئاب',
      'hypothyroidism', 'قصور الغدة الدرقية',
      'gerd', 'acid reflux', 'heartburn', 'ارتجاع', 'حرقة',
      'allergic rhinitis', 'hay fever', 'حساسية الأنف', 'حمى القش',
      'anemia', 'فقر دم', 'أنيميا',
      'back pain', 'ألم ظهر', 'lower back pain',
      'cold', 'common cold', 'نزلة برد', 'زكام',
      'acne', 'حب الشباب',
      'insomnia', 'الأرق', 'أرق',
      'migraine', 'الصداع النصفي',
      'osteoporosis', 'هشاشة العظام',
      'gastritis', 'التهاب المعدة',
      'hemorrhoids', 'البواسير',
      'tinnitus', 'طنين الأذن',
      'vertigo', 'دوار', 'dizziness',
      'psoriasis', 'الصدفية',
      'shingles', 'الهربس النطاقي',
      'gout', 'النقرس',
      'bronchitis', 'التهاب الشعب الهوائية',
      'pink eye', 'التهاب الملتحمة', 'conjunctivitis',
      'sinusitis', 'التهاب الجيوب الأنفية',
      'allergic reactions', 'الحساسية',
      'obesity', 'weight issues', 'السمنة',
      'skin infections', 'عدوى جلدية',
      'stroke', 'السكتة الدماغية',
      'eye strain', 'إجهاد العين'
    ];


    for (const condition of conditionKeywords) {
      if (lower.includes(condition)) {
        conditions.push(condition);
      }
    }

    return [...new Set(conditions)];
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
      },
      'gerd, acid reflux, heartburn, ارتجاع, حرقة': {
        en: `<div class="condition-response">
        <h4>ACID REFLUX (GERD) TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>Antacids:</b> Tums, Maalox (as needed)</li>
            <li><b>H2 blockers:</b> Famotidine 20-40mg daily</li>
            <li><b>PPIs:</b> Omeprazole 20mg daily before breakfast</li>
            <li><b>Alginate drugs:</b> Gaviscon after meals</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Long-term PPI use may cause nutrient deficiencies</li>
            <li>Avoid lying down 2-3 hours after eating</li>
            <li>Rule out heart disease for chest pain</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Lifestyle Changes:</h5>
          <ul>
            <li>Elevate head of bed 6-8 inches</li>
            <li>Avoid trigger foods (spicy, fatty, citrus, caffeine)</li>
            <li>Eat smaller, more frequent meals</li>
            <li>Maintain healthy weight</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج ارتجاع المريء</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>مضادات الحموضة:</b> تامس، مالوكس (حسب الحاجة)</li>
            <li><b>حاصرات H2:</b> فاموتيدين 20-40 مجم يوميًا</li>
            <li><b>مثبطات مضخة البروتون:</b> أوميبرازول 20 مجم يوميًا قبل الإفطار</li>
            <li><b>أدوية الألجينات:</b> جافيسكون بعد الوجبات</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>الاستخدام طويل الأمد لمثبطات مضخة البروتون قد يسبب نقصًا في العناصر الغذائية</li>
            <li>تجنب الاستلقاء بعد الأكل بـ 2-3 ساعات</li>
            <li>استبعد أمراض القلب لألم الصدر</li>
          </ul>
        </div>
        <div class="advice">
          <h5>تغييرات نمط الحياة:</h5>
          <ul>
            <li>ارفع رأس السرير 6-8 بوصات</li>
            <li>تجنب الأطعمة المحفزة (الحارة، الدهنية، الحمضيات، الكافيين)</li>
            <li>تناول وجبات صغيرة متكررة</li>
            <li>حافظ على وزن صحي</li>
          </ul>
        </div>
      </div>`
      },
      'allergic rhinitis, hay fever, حساسية الأنف, حمى القش': {
        en: `<div class="condition-response">
        <h4>ALLERGIC RHINITIS TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>Antihistamines:</b> Loratadine 10mg daily, Cetirizine 10mg daily</li>
            <li><b>Nasal steroids:</b> Fluticasone nasal spray daily</li>
            <li><b>Decongestants:</b> Pseudoephedrine (short-term use only)</li>
            <li><b>Eye drops:</b> Ketotifen for allergic conjunctivitis</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Nasal steroids may cause nosebleeds</li>
            <li>Decongestants can raise blood pressure</li>
            <li>First-gen antihistamines cause drowsiness</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Prevention:</h5>
          <ul>
            <li>Use HEPA air filters</li>
            <li>Wash bedding weekly in hot water</li>
            <li>Keep windows closed during pollen season</li>
            <li>Shower after outdoor exposure</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج حساسية الأنف</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>مضادات الهيستامين:</b> لوراتادين 10 مجم يوميًا، سيتريزين 10 مجم يوميًا</li>
            <li><b>بخاخات الأنف الستيرويدية:</b> فلوتيكازون يوميًا</li>
            <li><b>مزيلات الاحتقان:</b> سودوإيفيدرين (للاستخدام قصير المدى فقط)</li>
            <li><b>قطرات العين:</b> كيتوتيفين لالتهاب الملتحمة التحسسي</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>بخاخات الأنف الستيرويدية قد تسبب نزيف الأنف</li>
            <li>مزيلات الاحتقان قد ترفع ضغط الدم</li>
            <li>مضادات الهيستامين من الجيل الأول تسبب النعاس</li>
          </ul>
        </div>
        <div class="advice">
          <h5>الوقاية:</h5>
          <ul>
            <li>استخدم فلاتر هواء HEPA</li>
            <li>اغسل الفراش أسبوعيًا بالماء الساخن</li>
            <li>أغلق النوافذ خلال موسم حبوب اللقاح</li>
            <li>استحم بعد التعرض للخارج</li>
          </ul>
        </div>
      </div>`
      },
      'anemia, فقر دم, أنيميا': {
        en: `<div class="condition-response">
        <h4>ANEMIA TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Iron supplements:</b> Ferrous sulfate 325mg 1-3 times daily</li>
            <li><b>Vitamin C:</b> Enhances iron absorption (take with iron)</li>
            <li><b>B12 injections:</b> For pernicious anemia</li>
            <li><b>Folic acid:</b> For folate deficiency anemia</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Iron causes dark stools and constipation</li>
            <li>Take iron on empty stomach (unless GI upset occurs)</li>
            <li>Avoid calcium/antacids with iron (space by 2 hours)</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Dietary Advice:</h5>
          <ul>
            <li>Iron-rich foods: red meat, spinach, lentils</li>
            <li>Vitamin C-rich foods with iron meals</li>
            <li>Avoid tea/coffee with meals (inhibits iron absorption)</li>
            <li>Cook in cast iron pans</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج فقر الدم</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>مكملات الحديد:</b> سلفات الحديدوز 325 مجم 1-3 مرات يوميًا</li>
            <li><b>فيتامين سي:</b> يعزز امتصاص الحديد (تناوله مع الحديد)</li>
            <li><b>حقن B12:</b> لفقر الدم الخبيث</li>
            <li><b>حمض الفوليك:</b> لفقر الدم الناتج عن نقص الفولات</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>الحديد يسبب براز داكن وإمساك</li>
            <li>خذ الحديد على معدة فارغة (إلا إذا حدث اضطراب في المعدة)</li>
            <li>تجنب الكالسيوم/مضادات الحموضة مع الحديد (افصل بينهما بساعتين)</li>
          </ul>
        </div>
        <div class="advice">
          <h5>نصائح غذائية:</h5>
          <ul>
            <li>أطعمة غنية بالحديد: اللحوم الحمراء، السبانخ، العدس</li>
            <li>أطعمة غنية بفيتامين سي مع وجبات الحديد</li>
            <li>تجنب الشاي/القهوة مع الوجبات (تثبط امتصاص الحديد)</li>
            <li>اطبخ في أواني حديدية</li>
          </ul>
        </div>
      </div>`
      },
      'back pain, ألم ظهر, lower back pain': {
        en: `<div class="condition-response">
        <h4>BACK PAIN MANAGEMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>NSAIDs:</b> Ibuprofen 400-800mg every 6-8 hours</li>
            <li><b>Muscle relaxants:</b> Cyclobenzaprine 5-10mg at bedtime</li>
            <li><b>Topical analgesics:</b> Diclofenac gel</li>
            <li><b>Acetaminophen:</b> 500-1000mg every 6 hours</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Red Flags (Seek Immediate Care):</h5>
          <ul>
            <li>Bowel/bladder incontinence</li>
            <li>Leg weakness/numbness</li>
            <li>History of cancer</li>
            <li>Fever with back pain</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Stay active (avoid prolonged bed rest)</li>
            <li>Apply heat/ice packs</li>
            <li>Practice good posture</li>
            <li>Core-strengthening exercises</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>إدارة آلام الظهر</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>مضادات الالتهاب:</b> ايبوبروفين 400-800 مجم كل 6-8 ساعات</li>
            <li><b>مرخيات العضلات:</b> سيكلوبنزابرين 5-10 مجم عند النوم</li>
            <li><b>مسكنات موضعية:</b> جل ديكلوفيناك</li>
            <li><b>باراسيتامول:</b> 500-1000 مجم كل 6 ساعات</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>علامات خطر (اطلب الرعاية فورًا):</h5>
          <ul>
            <li>سلس البول/البراز</li>
            <li>ضعف/تنميل الساق</li>
            <li>تاريخ من السرطان</li>
            <li>حمى مع ألم الظهر</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>حافظ على النشاط (تجنب الراحة في الفراش لفترات طويلة)</li>
            <li>ضع كمادات ساخنة/باردة</li>
            <li>مارس وضعية جيدة</li>
            <li>تمارين تقوية العضلات الأساسية</li>
          </ul>
        </div>
      </div>`
      },
      'cold, common cold, نزلة برد, زكام': {
        en: `<div class="condition-response">
        <h4>COMMON COLD TREATMENT</h4>
        <div class="medications">
          <h5>Symptom Relief:</h5>
          <ul>
            <li><b>Decongestants:</b> Pseudoephedrine (oral) or oxymetazoline (nasal spray)</li>
            <li><b>Antihistamines:</b> Diphenhydramine at night (helps with sleep)</li>
            <li><b>Cough suppressants:</b> Dextromethorphan</li>
            <li><b>Pain relievers:</b> Acetaminophen or ibuprofen</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Don't use antibiotics for viral colds</li>
            <li>Limit nasal decongestant sprays to 3 days</li>
            <li>Watch for secondary infections (ear/sinus)</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Rest and stay hydrated</li>
            <li>Use saline nasal rinses</li>
            <li>Honey for cough (not under 1 year)</li>
            <li>Humidify the air</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج نزلة البرد</h4>
        <div class="medications">
          <h5>تخفيف الأعراض:</h5>
          <ul>
            <li><b>مزيلات الاحتقان:</b> سودوإيفيدرين (فموي) أو أوكسيميتازولين (بخاخ أنفي)</li>
            <li><b>مضادات الهيستامين:</b> دايفينهايدرامين ليلاً (يساعد على النوم)</li>
            <li><b>مثبطات السعال:</b> ديكستروميثورفان</li>
            <li><b>مسكنات الألم:</b> باراسيتامول أو ايبوبروفين</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>لا تستخدم المضادات الحيوية للبرد الفيروسي</li>
            <li>قلل من استخدام بخاخات الأنف المزيلة للاحتقان إلى 3 أيام</li>
            <li>راقب العدوى الثانوية (الأذن/الجيوب)</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>استرح واشرب السوائل</li>
            <li>استخدم غسول الأنف المالح</li>
            <li>العسل للسعال (ممنوع تحت سنة)</li>
            <li>رطب الهواء</li>
          </ul>
        </div>
      </div>`
      },
      'acne, حب الشباب': {
        en: `<div class="condition-response">
    <h4><i class="fas fa-bacteria icon-head"></i> Acne Treatment</h4>

    <div class="medications">
      <h5><i class="fas fa-capsules"></i> Medications:</h5>
      <ul>
        <li><b>Benzoyl Peroxide:</b> 2.5%-10% topical gel once or twice daily</li>
        <li><b>Topical Retinoids:</b> Adapalene or Tretinoin (apply at night)</li>
        <li><b>Oral Antibiotics:</b> Doxycycline, Minocycline (moderate/severe)</li>
        <li><b>Oral Isotretinoin:</b> For severe cases (under medical supervision)</li>
      </ul>
    </div>

    <div class="warnings">
      <h5><i class="fas fa-triangle-exclamation"></i> Warnings:</h5>
      <ul>
        <li>Increased sun sensitivity</li>
        <li>Do not pop pimples — may scar</li>
        <li>Avoid isotretinoin during pregnancy</li>
      </ul>
    </div>

    <div class="advice">
      <h5><i class="fas fa-lightbulb"></i> Self-Care Tips:</h5>
      <ul>
        <li>Use gentle cleansers twice daily</li>
        <li>Avoid oily products</li>
        <li>Stay hydrated and reduce stress</li>
      </ul>
    </div>
  </div>`,

        ar: `<div class="condition-response">
    <h4><i class="fas fa-bacteria icon-head"></i> علاج حب الشباب</h4>

    <div class="medications">
      <h5><i class="fas fa-capsules"></i> الأدوية:</h5>
      <ul>
        <li><b>بنزويل بيروكسيد:</b> جل موضعي بتركيز 2.5%-10%</li>
        <li><b>الريتينويدات:</b> أدابالين أو تريتينوين (ليلاً)</li>
        <li><b>مضادات حيوية فموية:</b> دوكسيسيكلين، مينوسيكلين</li>
        <li><b>ايزوتريتينوين:</b> لحالات حب الشباب الشديدة</li>
      </ul>
    </div>

    <div class="warnings">
      <h5><i class="fas fa-triangle-exclamation"></i> تحذيرات:</h5>
      <ul>
        <li>حساسية للشمس مع بعض الأدوية</li>
        <li>لا تفقع الحبوب</li>
        <li>يمنع استخدام الايزوتريتينوين أثناء الحمل</li>
      </ul>
    </div>

    <div class="advice">
      <h5><i class="fas fa-lightbulb"></i> نصائح:</h5>
      <ul>
        <li>استخدم غسولًا لطيفًا مرتين يوميًا</li>
        <li>تجنب المنتجات الدهنية</li>
        <li>اشرب ماء وقلل التوتر</li>
      </ul>
    </div>
  </div>`
      },
      'Insomnia , الأرق, insomnia, أرق ': {
        en: `<div class="condition-response">
        <h4>INSOMNIA TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>Melatonin:</b> 1-5mg 1 hour before bedtime</li>
            <li><b>Diphenhydramine:</b> 25-50mg at bedtime</li>
            <li><b>Prescription sleep aids:</b> Zolpidem, Eszopiclone (short-term use)</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Avoid alcohol with sleep medications</li>
            <li>Don't use long-term without doctor supervision</li>
            <li>May cause next-day drowsiness</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Sleep Hygiene Tips:</h5>
          <ul>
            <li>Maintain regular sleep schedule</li>
            <li>Create dark, quiet sleep environment</li>
            <li>Avoid screens 1 hour before bed</li>
            <li>Limit caffeine after noon</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج الأرق</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>الميلاتونين:</b> 1-5 مجم قبل النوم بساعة</li>
            <li><b>دايفينهايدرامين:</b> 25-50 مجم عند النوم</li>
            <li><b>منومات موصوفة:</b> زولبيديم، إيزوبيكلون (استخدام قصير المدى)</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>تجنب الكحول مع الأدوية المنومة</li>
            <li>لا تستخدم لفترات طويلة دون إشراف طبي</li>
            <li>قد تسبب النعاس في اليوم التالي</li>
          </ul>
        </div>
        <div class="advice">
          <h5>نصائح لنوم صحي:</h5>
          <ul>
            <li>حافظ على جدول نوم منتظم</li>
            <li>جهز بيئة نوم مظلمة وهادئة</li>
            <li>تجنب الشاشات قبل النوم بساعة</li>
            <li>قلل الكافيين بعد الظهر</li>
          </ul>
        </div>
      </div>`
      },
      'Migraine, migraine, الصداع النصفي': {
        en: `<div class="condition-response">
        <h4>MIGRAINE TREATMENT</h4>
        <div class="medications">
          <h5>Acute Treatments:</h5>
          <ul>
            <li><b>Triptans:</b> Sumatriptan 50-100mg at onset</li>
            <li><b>NSAIDs:</b> Ibuprofen 400-600mg</li>
            <li><b>Anti-nausea:</b> Metoclopramide 10mg</li>
          </ul>
          <h5>Preventive Treatments:</h5>
          <ul>
            <li><b>Propranolol:</b> 40-240mg daily</li>
            <li><b>Topiramate:</b> 25-100mg daily</li>
            <li><b>Amitriptyline:</b> 10-75mg at bedtime</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Limit triptans to 10 days/month</li>
            <li>Avoid opioids/butalbital for migraine</li>
            <li>Watch for medication-overuse headache</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Trigger Management:</h5>
          <ul>
            <li>Identify and avoid personal triggers</li>
            <li>Maintain regular sleep and meals</li>
            <li>Stay hydrated</li>
            <li>Consider relaxation techniques</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج الصداع النصفي</h4>
        <div class="medications">
          <h5>علاجات حادة:</h5>
          <ul>
            <li><b>التريبتانات:</b> سوماتريبتان 50-100 مجم عند البدء</li>
            <li><b>مضادات الالتهاب:</b> ايبوبروفين 400-600 مجم</li>
            <li><b>مضادات القيء:</b> ميتوكلوبراميد 10 مجم</li>
          </ul>
          <h5>علاجات وقائية:</h5>
          <ul>
            <li><b>بروبرانولول:</b> 40-240 مجم يوميًا</li>
            <li><b>توبيراميت:</b> 25-100 مجم يوميًا</li>
            <li><b>أميتريبتيلين:</b> 10-75 مجم عند النوم</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>لا تستخدم التريبتانات أكثر من 10 أيام/شهر</li>
            <li>تجنب المواد الأفيونية للصداع النصفي</li>
            <li>احذر من صداع فرط استخدام الأدوية</li>
          </ul>
        </div>
        <div class="advice">
          <h5>إدارة المحفزات:</h5>
          <ul>
            <li>حدد وتجنب محفزاتك الشخصية</li>
            <li>حافظ على نوم ووجبات منتظمة</li>
            <li>اشرب كمية كافية من الماء</li>
            <li>جرب تقنيات الاسترخاء</li>
          </ul>
        </div>
      </div>`
      },
      'Osteoporosis , هشاشة العظام': {
        en: `<div class="condition-response">
        <h4>OSTEOPOROSIS TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>Bisphosphonates:</b> Alendronate 70mg weekly</li>
            <li><b>Calcium:</b> 1000-1200mg daily with Vitamin D</li>
            <li><b>Vitamin D:</b> 800-2000 IU daily</li>
            <li><b>Other options:</b> Denosumab, Teriparatide</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Take bisphosphonates on empty stomach with water</li>
            <li>Remain upright for 30-60 minutes after dose</li>
            <li>Dental exams before starting treatment</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Lifestyle Advice:</h5>
          <ul>
            <li>Weight-bearing exercise</li>
            <li>Fall prevention strategies</li>
            <li>Quit smoking</li>
            <li>Limit alcohol</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج هشاشة العظام</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>البايفوسفونيت:</b> أليندرونات 70 مجم أسبوعيًا</li>
            <li><b>الكالسيوم:</b> 1000-1200 مجم يوميًا مع فيتامين د</li>
            <li><b>فيتامين د:</b> 800-2000 وحدة دولية يوميًا</li>
            <li><b>خيارات أخرى:</b> دينوسوماب، تيريباراتايد</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>خذ البايفوسفونيت على معدة فارغة مع الماء</li>
            <li>ابق منتصبًا لمدة 30-60 دقيقة بعد الجرعة</li>
            <li>فحص الأسنان قبل بدء العلاج</li>
          </ul>
        </div>
        <div class="advice">
          <h5>نصائح لنمط الحياة:</h5>
          <ul>
            <li>تمارين تحمل الوزن</li>
            <li>استراتيجيات منع السقوط</li>
            <li>الإقلاع عن التدخين</li>
            <li>الحد من الكحول</li>
          </ul>
        </div>
      </div>`
      },
      'Gastritis , التهاب المعدة': {
        en: `<div class="condition-response">
        <h4>GASTRITIS TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>PPIs:</b> Omeprazole 20-40mg daily</li>
            <li><b>H2 blockers:</b> Famotidine 20-40mg twice daily</li>
            <li><b>Antacids:</b> For symptom relief</li>
            <li><b>Antibiotics:</b> For H. pylori infection</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Avoid NSAIDs and alcohol</li>
            <li>Watch for signs of bleeding</li>
            <li>Complete antibiotic course if prescribed</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Dietary Advice:</h5>
          <ul>
            <li>Eat smaller, more frequent meals</li>
            <li>Avoid spicy, acidic, fried foods</li>
            <li>Limit caffeine and carbonated drinks</li>
            <li>Manage stress</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج التهاب المعدة</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>مثبطات مضخة البروتون:</b> أوميبرازول 20-40 مجم يوميًا</li>
            <li><b>حاصرات H2:</b> فاموتيدين 20-40 مجم مرتين يوميًا</li>
            <li><b>مضادات الحموضة:</b> لتخفيف الأعراض</li>
            <li><b>المضادات الحيوية:</b> لعدوى الملوية البوابية</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>تجنب مضادات الالتهاب والكحول</li>
            <li>راقب علامات النزيف</li>
            <li>أكمل دورة المضادات الحيوية إذا وصفها الطبيب</li>
          </ul>
        </div>
        <div class="advice">
          <h5>نصائح غذائية:</h5>
          <ul>
            <li>تناول وجبات صغيرة متكررة</li>
            <li>تجنب الأطعمة الحارة والحامضة والمقلية</li>
            <li>قلل من الكافيين والمشروبات الغازية</li>
            <li>تحكم في التوتر</li>
          </ul>
        </div>
      </div>`
      },
      'Hemorrhoids , البواسير': {
        en: `<div class="condition-response">
        <h4>HEMORRHOID TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Topical creams:</b> Hydrocortisone 1% or pramoxine</li>
            <li><b>Stool softeners:</b> Docusate sodium</li>
            <li><b>Oral pain relievers:</b> Acetaminophen (avoid NSAIDs)</li>
            <li><b>Sitz baths:</b> Warm water 10-15 minutes 2-3 times daily</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Don't use topical steroids >1 week</li>
            <li>Seek help for rectal bleeding</li>
            <li>Avoid straining during bowel movements</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Prevention:</h5>
          <ul>
            <li>High fiber diet (25-30g daily)</li>
            <li>Stay hydrated</li>
            <li>Regular exercise</li>
            <li>Don't delay bowel movements</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج البواسير</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>كريمات موضعية:</b> هيدروكورتيزون 1% أو براموكسين</li>
            <li><b>ملينات البراز:</b> دوكوسات الصوديوم</li>
            <li><b>مسكنات الألم الفموية:</b> باراسيتامول (تجنب مضادات الالتهاب)</li>
            <li><b>حمامات المقعدة:</b> ماء دافئ 10-15 دقيقة 2-3 مرات يوميًا</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>لا تستخدم الستيرويدات الموضعية لأكثر من أسبوع</li>
            <li>اطلب المساعدة للنزيف الشرجي</li>
            <li>تجنب الإجهاد أثناء التبرز</li>
          </ul>
        </div>
        <div class="advice">
          <h5>الوقاية:</h5>
          <ul>
            <li>نظام غذائي غني بالألياف (25-30 جم يوميًا)</li>
            <li>اشرب كمية كافية من الماء</li>
            <li>ممارسة الرياضة بانتظام</li>
            <li>لا تؤجل التبرز</li>
          </ul>
        </div>
      </div>`
      },
      'Tinnitus , طنين الأذن': {
        en: `<div class="condition-response">
        <h4>TINNITUS MANAGEMENT</h4>
        <div class="medications">
          <h5>Possible Treatments:</h5>
          <ul>
            <li><b>Hearing aids:</b> If hearing loss present</li>
            <li><b>Sound therapy:</b> White noise machines</li>
            <li><b>Cognitive behavioral therapy:</b> For distress</li>
            <li><b>Medications:</b> Sometimes antidepressants or anxiolytics</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Avoid ototoxic medications if possible</li>
            <li>Protect ears from loud noise</li>
            <li>Rule out serious underlying causes</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Background noise/music</li>
            <li>Stress reduction techniques</li>
            <li>Limit caffeine and alcohol</li>
            <li>Support groups</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>إدارة طنين الأذن</h4>
        <div class="medications">
          <h5>العلاجات الممكنة:</h5>
          <ul>
            <li><b>سماعات الأذن:</b> إذا كان هناك فقدان سمع</li>
            <li><b>العلاج بالصوت:</b> أجهزة الضوضاء البيضاء</li>
            <li><b>العلاج السلوكي المعرفي:</b> للضيق النفسي</li>
            <li><b>الأدوية:</b> أحيانًا مضادات الاكتئاب أو مضادات القلق</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>تجنب الأدوية السامة للأذن إذا أمكن</li>
            <li>احمي أذنيك من الضوضاء العالية</li>
            <li>استبعد الأسباب الكامنة الخطيرة</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>ضوضاء/موسيقى خلفية</li>
            <li>تقنيات تقليل التوتر</li>
            <li>قلل من الكافيين والكحول</li>
            <li>مجموعات الدعم</li>
          </ul>
        </div>
      </div>`
      },
      'Vertigo , دوار, dizziness':
      {
        en: `<div class="condition-response">
        <h4>VERTIGO TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>Antihistamines:</b> Meclizine 25mg every 6 hours</li>
            <li><b>Anti-nausea:</b> Promethazine or ondansetron</li>
            <li><b>Benzodiazepines:</b> Short-term for severe cases</li>
            <li><b>Epley maneuver:</b> For BPPV</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Medications may cause drowsiness</li>
            <li>Don't drive while dizzy</li>
            <li>Rule out stroke in acute onset</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Move slowly, especially head movements</li>
            <li>Stay hydrated</li>
            <li>Sleep with head slightly elevated</li>
            <li>Vestibular rehabilitation exercises</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج الدوار</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>مضادات الهيستامين:</b> ميكليزين 25 مجم كل 6 ساعات</li>
            <li><b>مضادات القيء:</b> بروميثازين أو أوندانسيترون</li>
            <li><b>البنزوديازيبينات:</b> قصيرة المدى للحالات الشديدة</li>
            <li><b>مناورة إبلي:</b> للدوار الوضعي الحميد</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>الأدوية قد تسبب النعاس</li>
            <li>لا تقود أثناء الدوخة</li>
            <li>استبعد السكتة الدماغية في البداية الحادة</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>تحرك ببطء، خاصة حركات الرأس</li>
            <li>اشرب كمية كافية من الماء</li>
            <li>نم ورأسك مرتفع قليلاً</li>
            <li>تمارين إعادة تأهيل دهليزي</li>
          </ul>
        </div>
      </div>`
      },
      'Psoriasis , الصدفية': {
        en: `<div class="condition-response">
        <h4>PSORIASIS TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Topical steroids:</b> For mild cases</li>
            <li><b>Vitamin D analogs:</b> Calcipotriene</li>
            <li><b>Phototherapy:</b> UVB or PUVA</li>
            <li><b>Systemic medications:</b> Methotrexate, cyclosporine</li>
            <li><b>Biologics:</b> For moderate-severe cases</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Don't overuse topical steroids</li>
            <li>Regular skin checks needed</li>
            <li>Monitor for psoriatic arthritis</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Moisturize skin regularly</li>
            <li>Limit alcohol</li>
            <li>Manage stress</li>
            <li>Quit smoking</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج الصدفية</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>الستيرويدات الموضعية:</b> للحالات الخفيفة</li>
            <li><b>نظائر فيتامين د:</b> كالسيبوتريين</li>
            <li><b>العلاج الضوئي:</b> UVB أو PUVA</li>
            <li><b>أدوية جهازية:</b> ميثوتريكسات، سيكلوسبورين</li>
            <li><b>البيولوجية:</b> للحالات المتوسطة-الشديدة</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>لا تفرط في استخدام الستيرويدات الموضعية</li>
            <li>مطلوب فحوصات جلدية منتظمة</li>
            <li>راقب التهاب المفاصل الصدفي</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>رطب بشرتك بانتظام</li>
            <li>قلل من الكحول</li>
            <li>تحكم في التوتر</li>
            <li>الإقلاع عن التدخين</li>
          </ul>
        </div>
      </div>`
      },
      'Shingles , الهربس النطاقي': {
        en: `<div class="condition-response">
        <h4>SHINGLES TREATMENT</h4>
        <div class="medications">
          <h5>Common Medications:</h5>
          <ul>
            <li><b>Antivirals:</b> Acyclovir, valacyclovir (start within 72 hours)</li>
            <li><b>Pain control:</b> NSAIDs, gabapentin, or opioids if severe</li>
            <li><b>Topical treatments:</b> Calamine lotion, capsaicin cream</li>
            <li><b>Vaccine:</b> Shingrix for prevention</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Antivirals most effective when started early</li>
            <li>Watch for secondary infection</li>
            <li>May develop postherpetic neuralgia</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Keep rash clean and dry</li>
            <li>Cool compresses for pain</li>
            <li>Loose clothing</li>
            <li>Don't scratch blisters</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج الهربس النطاقي</h4>
        <div class="medications">
          <h5>الأدوية الشائعة:</h5>
          <ul>
            <li><b>مضادات الفيروسات:</b> أسيكلوفير، فالاسيكلوفير (ابدأ خلال 72 ساعة)</li>
            <li><b>التحكم في الألم:</b> مضادات الالتهاب، جابابنتين، أو المواد الأفيونية إذا كان شديدًا</li>
            <li><b>علاجات موضعية:</b> كالامين لوشن، كريم كبسايسين</li>
            <li><b>اللقاح:</b> شينجريكس للوقاية</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>مضادات الفيروسات أكثر فعالية عند البدء مبكرًا</li>
            <li>راقب العدوى الثانوية</li>
            <li>قد يتطور إلى ألم عصبي تال للهربس</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>حافظ على الطفح نظيفًا وجافًا</li>
            <li>كمادات باردة للألم</li>
            <li>ملابس فضفاضة</li>
            <li>لا تخدش البثور</li>
          </ul>
        </div>
      </div>`
      },
      'Gout , النقرس': {
        en: `<div class="condition-response">
        <h4>GOUT TREATMENT</h4>
        <div class="medications">
          <h5>Acute Attack Treatment:</h5>
          <ul>
            <li><b>NSAIDs:</b> Indomethacin or naproxen</li>
            <li><b>Colchicine:</b> 1.2mg initially, then 0.6mg 1 hour later</li>
            <li><b>Steroids:</b> Prednisone if NSAIDs contraindicated</li>
          </ul>
          <h5>Preventive Treatment:</h5>
          <ul>
            <li><b>Allopurinol:</b> Start at 100mg daily</li>
            <li><b>Febuxostat:</b> Alternative to allopurinol</li>
            <li><b>Probenecid:</b> For underexcretors</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Avoid alcohol during attacks</li>
            <li>Don't start allopurinol during acute attack</li>
            <li>Stay hydrated</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Dietary Advice:</h5>
          <ul>
            <li>Limit red meat and seafood</li>
            <li>Avoid high-fructose corn syrup</li>
            <li>Low-fat dairy may be protective</li>
            <li>Cherries may help lower uric acid</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج النقرس</h4>
        <div class="medications">
          <h5>علاج النوبة الحادة:</h5>
          <ul>
            <li><b>مضادات الالتهاب:</b> إندوميثاسين أو نابروكسين</li>
            <li><b>كولشيسين:</b> 1.2 مجم أولاً، ثم 0.6 مجم بعد ساعة</li>
            <li><b>الستيرويدات:</b> بريدنيزون إذا كانت مضادات الالتهاب ممنوعة</li>
          </ul>
          <h5>العلاج الوقائي:</h5>
          <ul>
            <li><b>ألوبيورينول:</b> ابدأ بـ 100 مجم يوميًا</li>
            <li><b>فيبوكسوستات:</b> بديل لألوبيورينول</li>
            <li><b>بروبينسيد:</b> لمن يعانون من نقص إفراز</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>تجنب الكحول أثناء النوبات</li>
            <li>لا تبدأ ألوبيورينول أثناء النوبة الحادة</li>
            <li>اشرب كمية كافية من الماء</li>
          </ul>
        </div>
        <div class="advice">
          <h5>نصائح غذائية:</h5>
          <ul>
            <li>قلل من اللحوم الحمراء والمأكولات البحرية</li>
            <li>تجنب شراب الذرة عالي الفركتوز</li>
            <li>منتجات الألبان قليلة الدسم قد تكون وقائية</li>
            <li>الكرز قد يساعد في خفض حمض اليوريك</li>
          </ul>
        </div>
      </div>`
      },
      'Bronchitis , التهاب الشعب الهوائية': {
        en: `<div class="condition-response">
        <h4>BRONCHITIS TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Cough suppressants:</b> Dextromethorphan for dry cough</li>
            <li><b>Expectorants:</b> Guaifenesin for productive cough</li>
            <li><b>Bronchodilators:</b> For wheezing (albuterol inhaler)</li>
            <li><b>Pain relievers:</b> Acetaminophen or ibuprofen</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Antibiotics usually not helpful (viral cause)</li>
            <li>Seek care if symptoms worsen or last >3 weeks</li>
            <li>Smokers at higher risk for complications</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Stay hydrated</li>
            <li>Use humidifier</li>
            <li>Rest</li>
            <li>Avoid irritants (smoke, pollution)</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج التهاب الشعب الهوائية</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>مثبطات السعال:</b> ديكستروميثورفان للسعال الجاف</li>
            <li><b>مذيبات البلغم:</b> جوايفينيسين للسعال المنتج</li>
            <li><b>موسعات الشعب الهوائية:</b> للصفير (بخاخ ألبوتيرول)</li>
            <li><b>مسكنات الألم:</b> باراسيتامول أو ايبوبروفين</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>المضادات الحيوية عادة غير مفيدة (سبب فيروسي)</li>
            <li>اطلب الرعاية إذا ساءت الأعراض أو استمرت >3 أسابيع</li>
            <li>المدخنون أكثر عرضة للمضاعفات</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>اشرب كمية كافية من الماء</li>
            <li>استخدم مرطب الهواء</li>
            <li>استرح</li>
            <li>تجنب المهيجات (الدخان، التلوث)</li>
          </ul>
        </div>
      </div>`
      },
      'Pink Eye , التهاب الملتحمة, conjunctivitis': {
        en: `<div class="condition-response">
        <h4>PINK EYE (CONJUNCTIVITIS) TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Bacterial:</b> Antibiotic drops (erythromycin, ciprofloxacin)</li>
            <li><b>Viral:</b> Artificial tears, cold compresses</li>
            <li><b>Allergic:</b> Antihistamine drops (ketotifen)</li>
            <li><b>Artificial tears:</b> For comfort</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Don't share towels/pillows</li>
            <li>Don't wear contacts until resolved</li>
            <li>Seek care for vision changes/severe pain</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Wash hands frequently</li>
            <li>Clean eyelids with warm water</li>
            <li>Discard eye makeup after infection</li>
            <li>Don't rub eyes</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج العين الوردية (التهاب الملتحمة)</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>البكتيري:</b> قطرات مضاد حيوي (إريثروميسين، سيبروفلوكساسين)</li>
            <li><b>الفيروسي:</b> دموع اصطناعية، كمادات باردة</li>
            <li><b>التحسسي:</b> قطرات مضاد الهيستامين (كيتوتيفين)</li>
            <li><b>الدموع الاصطناعية:</b> للراحة</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>لا تشارك المناشف/الوسائد</li>
            <li>لا ترتدي العدسات حتى الشفاء</li>
            <li>اطلب الرعاية لتغيرات الرؤية/ألم شديد</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>اغسل يديك frequently</li>
            <li>نظف الجفون بالماء الدافئ</li>
            <li>تخلص من مكياج العيون بعد العدوى</li>
            <li>لا تفرك عينيك</li>
          </ul>
        </div>
      </div>`
      },
      'Sinusitis , التهاب الجيوب الأنفية': {
        en: `<div class="condition-response">
        <h4>SINUSITIS TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Nasal saline irrigation:</b> Neti pot or spray</li>
            <li><b>Nasal steroids:</b> Fluticasone nasal spray</li>
            <li><b>Decongestants:</b> Pseudoephedrine (short-term)</li>
            <li><b>Antibiotics:</b> Only for bacterial sinusitis</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warnings:</h5>
          <ul>
            <li>Don't use decongestant sprays >3 days</li>
            <li>Seek care for severe headache/fever</li>
            <li>Complete antibiotic course if prescribed</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Self-Care:</h5>
          <ul>
            <li>Stay hydrated</li>
            <li>Use humidifier</li>
            <li>Warm compresses for pain</li>
            <li>Elevate head while sleeping</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج التهاب الجيوب الأنفية</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>غسيل الأنف المالح:</b> وعاء نيتي أو بخاخ</li>
            <li><b>بخاخات الأنف الستيرويدية:</b> فلوتيكازون</li>
            <li><b>مزيلات الاحتقان:</b> سودوإيفيدرين (قصير المدى)</li>
            <li><b>المضادات الحيوية:</b> فقط للالتهاب البكتيري</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>تحذيرات:</h5>
          <ul>
            <li>لا تستخدم بخاخات مزيلة للاحتقان لأكثر من 3 أيام</li>
            <li>اطلب الرعاية للصداع الشديد/الحمى</li>
            <li>أكمل دورة المضادات الحيوية إذا وصفها الطبيب</li>
          </ul>
        </div>
        <div class="advice">
          <h5>العناية الذاتية:</h5>
          <ul>
            <li>اشرب كمية كافية من الماء</li>
            <li>استخدم مرطب الهواء</li>
            <li>كمادات دافئة للألم</li>
            <li>ارفع رأسك أثناء النوم</li>
          </ul>
        </div>
      </div>`
      },
      'Allergic Reactions , الحساسية': {
        en: `<div class="condition-response">
        <h4>ALLERGIC REACTION TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Antihistamines:</b> Diphenhydramine 25-50mg, Loratadine 10mg</li>
            <li><b>Epinephrine auto-injector:</b> For anaphylaxis (0.3mg IM)</li>
            <li><b>Corticosteroids:</b> Prednisone for severe reactions</li>
            <li><b>Bronchodilators:</b> Albuterol for respiratory symptoms</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Emergency Signs:</h5>
          <ul>
            <li>Difficulty breathing/swallowing</li>
            <li>Swelling of face/tongue</li>
            <li>Dizziness or fainting</li>
            <li>Use epinephrine and call emergency</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Prevention:</h5>
          <ul>
            <li>Identify and avoid triggers</li>
            <li>Carry emergency medications</li>
            <li>Wear medical alert bracelet</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج الحساسية</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>مضادات الهيستامين:</b> دايفينهايدرامين 25-50 مجم، لوراتادين 10 مجم</li>
            <li><b>الحقن التلقائي للإبينفرين:</b> لالتأق (0.3 مجم عضلي)</li>
            <li><b>الكورتيكوستيرويدات:</b> بريدنيزون للحالات الشديدة</li>
            <li><b>موسعات الشعب الهوائية:</b> ألبوتيرول لأعراض الجهاز التنفسي</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>علامات الطوارئ:</h5>
          <ul>
            <li>صعوبة في التنفس/البلع</li>
            <li>تورم الوجه/اللسان</li>
            <li>دوار أو إغماء</li>
            <li>استخدم الإبينفرين واتصل بالطوارئ</li>
          </ul>
        </div>
        <div class="advice">
          <h5>الوقاية:</h5>
          <ul>
            <li>حدد وتجنب المحفزات</li>
            <li>احمل أدوية الطوارئ</li>
            <li>ارتد سوار تنبيه طبي</li>
          </ul>
        </div>
      </div>`
      },
      'Obesity , Weight Issues ,السمنة': {
        en: `<div class="condition-response">
        <h4>WEIGHT MANAGEMENT</h4>
        <div class="medications">
          <h5>Medical Options:</h5>
          <ul>
            <li><b>GLP-1 agonists:</b> Semaglutide (Wegovy®)</li>
            <li><b>Other medications:</b> Orlistat, Phentermine-Topiramate</li>
            <li><b>Bariatric surgery:</b> For BMI >40 or >35 with comorbidities</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Health Risks:</h5>
          <ul>
            <li>Diabetes, hypertension, heart disease</li>
            <li>Sleep apnea, joint problems</li>
            <li>Avoid crash diets</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Lifestyle Changes:</h5>
          <ul>
            <li>Calorie deficit (500-1000 kcal/day)</li>
            <li>150+ mins exercise weekly</li>
            <li>Behavioral therapy for eating habits</li>
            <li>High-protein, high-fiber diet</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>إدارة الوزن</h4>
        <div class="medications">
          <h5>الخيارات الطبية:</h5>
          <ul>
            <li><b>ناهضات GLP-1:</b> سيماجلوتايد (ويجوفي)</li>
            <li><b>أدوية أخرى:</b> أورليستات، فينترمين-توبيراميت</li>
            <li><b>جراحة السمنة:</b> لمؤشر كتلة الجسم >40 أو >35 مع أمراض مصاحبة</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>المخاطر الصحية:</h5>
          <ul>
            <li>السكري، ارتفاع الضغط، أمراض القلب</li>
            <li>انقطاع النفس النومي، مشاكل المفاصل</li>
            <li>تجنب الحميات القاسية</li>
          </ul>
        </div>
        <div class="advice">
          <h5>تغييرات نمط الحياة:</h5>
          <ul>
            <li>عجز حراري (500-1000 سعرة/يوم)</li>
            <li>150+ دقيقة تمارين أسبوعيًا</li>
            <li>العلاج السلوكي لعادات الأكل</li>
            <li>نظام عالي البروتين والألياف</li>
          </ul>
        </div>
      </div>`
      },
      'Skin Infections , عدوى جلدية': {
        en: `<div class="condition-response">
        <h4>SKIN INFECTION TREATMENT</h4>
        <div class="medications">
          <h5>Common Treatments:</h5>
          <ul>
            <li><b>Cellulitis:</b> Cephalexin 500mg QID, Dicloxacillin</li>
            <li><b>Impetigo:</b> Mupirocin ointment or oral antibiotics</li>
            <li><b>Fungal:</b> Clotrimazole cream, terbinafine</li>
            <li><b>MRSA:</b> Bactrim, Doxycycline, Clindamycin</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warning Signs:</h5>
          <ul>
            <li>Spreading redness, fever</li>
            <li>Pus or abscess formation</li>
            <li>Diabetic foot infections</li>
            <li>Complete full antibiotic course</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Prevention:</h5>
          <ul>
            <li>Proper wound care</li>
            <li>Hand hygiene</li>
            <li>Don't share personal items</li>
            <li>Moisturize dry skin</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>علاج العدوى الجلدية</h4>
        <div class="medications">
          <h5>العلاجات الشائعة:</h5>
          <ul>
            <li><b>التهاب النسيج الخلوي:</b> سيفاليكسين 500 مجم 4 مرات يوميًا، ديكلوكساسيلين</li>
            <li><b>القوباء:</b> مرهم موبيروسين أو مضادات حيوية فموية</li>
            <li><b>الفطريات:</b> كريم كلوتريمازول، تيربينافين</li>
            <li><b>MRSA:</b> باكتريم، دوكسيسيكلين، كليندامايسين</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>علامات التحذير:</h5>
          <ul>
            <li>احمرار منتشر، حمى</li>
            <li>تكون صديد أو خراج</li>
            <li>عدوى قدم مريض السكري</li>
            <li>أكمل دورة المضاد الحيوي كاملة</li>
          </ul>
        </div>
        <div class="advice">
          <h5>الوقاية:</h5>
          <ul>
            <li>العناية المناسبة بالجروح</li>
            <li>نظافة اليدين</li>
            <li>لا تشارك الأدوات الشخصية</li>
            <li>رطب البشرة الجافة</li>
          </ul>
        </div>
      </div>`
      },
      'Stroke , السكتة الدماغية': {
        en: `<div class="condition-response">
        <h4>STROKE/TIA MANAGEMENT</h4>
        <div class="medications">
          <h5>Acute Treatment:</h5>
          <ul>
            <li><b>tPA:</b> Within 4.5 hours of ischemic stroke</li>
            <li><b>Aspirin:</b> 325mg initially (after ruling out hemorrhage)</li>
            <li><b>Blood pressure control:</b> Labetalol, Nicardipine IV</li>
          </ul>
          <h5>Prevention:</h5>
          <ul>
            <li><b>Antiplatelets:</b> Aspirin, Clopidogrel</li>
            <li><b>Anticoagulants:</b> For AFib (Warfarin, DOACs)</li>
            <li><b>Statins:</b> High-intensity for secondary prevention</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>FAST Recognition:</h5>
          <ul>
            <li>Face drooping</li>
            <li>Arm weakness</li>
            <li>Speech difficulty</li>
            <li>Time to call emergency</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Risk Reduction:</h5>
          <ul>
            <li>Blood pressure control</li>
            <li>Smoking cessation</li>
            <li>Atrial fibrillation management</li>
            <li>Carotid endarterectomy if indicated</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>إدارة الجلطة/NMO</h4>
        <div class="medications">
          <h5>العلاج الحاد:</h5>
          <ul>
            <li><b>منشط البلازمينوجين النسيجي:</b> خلال 4.5 ساعة من الجلطة</li>
            <li><b>أسبرين:</b> 325 مجم أولياً (بعد استبعاد النزيف)</li>
            <li><b>التحكم في ضغط الدم:</b> لابيتالول، نيكارديبين وريدي</li>
          </ul>
          <h5>الوقاية:</h5>
          <ul>
            <li><b>مضادات الصفائح:</b> أسبرين، كلوبيدوجريل</li>
            <li><b>مضادات التخثر:</b> للرجفان الأذيني (وارفارين، DOACs)</li>
            <li><b>الستاتينات:</b> عالية الكثافة للوقاية الثانوية</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>التعرف السريع (FAST):</h5>
          <ul>
            <li>تدلي الوجه</li>
            <li>ضعف الذراع</li>
            <li>صعوبة الكلام</li>
            <li>حان وقت الاتصال بالطوارئ</li>
          </ul>
        </div>
        <div class="advice">
          <h5>تقليل المخاطر:</h5>
          <ul>
            <li>التحكم في ضغط الدم</li>
            <li>الإقلاع عن التدخين</li>
            <li>إدارة الرجفان الأذيني</li>
            <li>استئصال باطنة الشريان السباتي إذا لزم الأمر</li>
          </ul>
        </div>
      </div>`
      },
      'Eye Strain, إجهاد العين': {
        en: `<div class="condition-response">
        <h4>EYE STRAIN RELIEF</h4>
        <div class="medications">
          <h5>Symptom Relief:</h5>
          <ul>
            <li><b>Artificial tears:</b> Preservative-free for dry eyes</li>
            <li><b>Antihistamine drops:</b> For allergy-related strain</li>
            <li><b>Blue light glasses:</b> May help with screen use</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>Warning Signs:</h5>
          <ul>
            <li>Persistent vision changes</li>
            <li>Severe eye pain</li>
            <li>Light sensitivity</li>
            <li>Rule out glaucoma/other conditions</li>
          </ul>
        </div>
        <div class="advice">
          <h5>Prevention:</h5>
          <ul>
            <li>20-20-20 rule: Every 20 mins, look 20 feet away for 20 sec</li>
            <li>Proper screen distance (arm's length)</li>
            <li>Adjust lighting to reduce glare</li>
            <li>Blink frequently</li>
          </ul>
        </div>
      </div>`,
        ar: `<div class="condition-response">
        <h4>تخفيف إجهاد العين</h4>
        <div class="medications">
          <h5>تخفيف الأعراض:</h5>
          <ul>
            <li><b>الدموع الاصطناعية:</b> خالية من المواد الحافظة للعين الجافة</li>
            <li><b>قطرات مضاد الهيستامين:</b> للإجهاد المرتبط بالحساسية</li>
            <li><b>نظارات الضوء الأزرق:</b> قد تساعد مع استخدام الشاشة</li>
          </ul>
        </div>
        <div class="warnings">
          <h5>علامات التحذير:</h5>
          <ul>
            <li>تغيرات مستمرة في الرؤية</li>
            <li>ألم شديد في العين</li>
            <li>الحساسية للضوء</li>
            <li>استبعد الزرق/حالات أخرى</li>
          </ul>
        </div>
        <div class="advice">
          <h5>الوقاية:</h5>
          <ul>
            <li>قاعدة 20-20-20: كل 20 دقيقة، انظر لمسافة 20 قدمًا لمدة 20 ثانية</li>
            <li>مسافة شاشة مناسبة (طول الذراع)</li>
            <li>اضبط الإضاءة لتقليل الوهج</li>
            <li>اغمض عينيك frequently</li>
          </ul>
        </div>
      </div>`
      },



    };




    for (const key in knowledgeBase) {
      const keywords = key.split(',').map(k => k.trim());
      if (keywords.some(k => k.toLowerCase() === condition.toLowerCase())) {
        return isArabic ? knowledgeBase[key].ar : knowledgeBase[key].en;
      }
    }

    return null;
  }
}