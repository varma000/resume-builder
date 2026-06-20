// ─── PAGE NAVIGATION ───────────────────────────────────────────
function showBuilder() {
  document.getElementById('landingPage').style.display = 'none';
  document.getElementById('builderPage').style.display = 'block';
}

function showLanding() {
  document.getElementById('landingPage').style.display = 'block';
  document.getElementById('builderPage').style.display = 'none';
}

function goBack() {
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
  document.getElementById('stepTab1').classList.add('active');
  document.getElementById('stepTab2').classList.remove('active');
  document.getElementById('loadingOverlay').style.display = 'flex';
  document.getElementById('resumeOutput').style.display = 'none';
  isEditing = false;
  document.getElementById('editToggle').textContent = '✏ Edit resume';
  document.getElementById('editToggle').classList.remove('active-tool');
}

// ─── GROQ API KEY (FREE) ───────────────────────────────────────
const GROQ_API_KEY = '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';

// ─── RESUME GENERATION ─────────────────────────────────────────
const LOADING_MESSAGES = [
  'AI is crafting your resume...',
  'Writing your work experience...',
  'Adding skills and achievements...',
  'Polishing the final details...',
  'Almost there...'
];

async function generateResume() {
  const name     = document.getElementById('inputName').value.trim();
  const desig    = document.getElementById('inputDesig').value.trim();
  const exp      = document.getElementById('inputExp').value;
  const industry = document.getElementById('inputIndustry').value.trim();
  const email    = document.getElementById('inputEmail').value.trim();
  const phone    = document.getElementById('inputPhone').value.trim();
  const city     = document.getElementById('inputCity').value.trim();

  const errEl = document.getElementById('formError');
  if (!name || !desig) { errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';

  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  document.getElementById('stepTab1').classList.remove('active');
  document.getElementById('stepTab2').classList.add('active');
  document.getElementById('loadingOverlay').style.display = 'flex';
  document.getElementById('resumeOutput').style.display = 'none';

  let msgIdx = 0;
  const loadInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
    document.getElementById('loadingMsg').textContent = LOADING_MESSAGES[msgIdx];
  }, 1800);

  const prompt = `You are an expert professional resume writer. Create a complete, impressive resume for:

Name: ${name}
Designation: ${desig}
${exp ? 'Experience level: ' + exp : ''}
${industry ? 'Industry: ' + industry : ''}
${email ? 'Email: ' + email : ''}
${phone ? 'Phone: ' + phone : ''}
${city ? 'Location: ' + city : ''}

Return ONLY a valid JSON object. No markdown, no backticks, no extra text. Use this exact structure:
{
  "name": "${name}",
  "designation": "${desig}",
  "email": "${email || 'professional.email@gmail.com'}",
  "phone": "${phone || '+91-98765 43210'}",
  "location": "${city || 'Mumbai, Maharashtra'}",
  "linkedin": "linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}",
  "summary": "Write a compelling 3-4 sentence professional summary tailored to the designation.",
  "experience": [
    {
      "role": "Most recent job title",
      "company": "Company name",
      "duration": "Jan 2022 - Present",
      "bullets": [
        "Quantified achievement with impact (use numbers/metrics)",
        "Another strong achievement",
        "Third achievement or responsibility"
      ]
    }
  ],
  "skills": ["skill1","skill2","skill3","skill4","skill5","skill6","skill7","skill8","skill9","skill10"],
  "education": [
    {
      "degree": "Bachelor degree relevant to the role",
      "school": "University/College Name",
      "year": "2019"
    }
  ],
  "certifications": ["Relevant certification 1", "Relevant certification 2"]
}

Rules:
- Generate 2-3 experience entries (most recent first)
- Each experience should have 3-4 bullet points with numbers/metrics where possible
- Skills should be specific and relevant to the designation (10 skills)
- Make everything realistic, professional, and impressive
- Return ONLY the raw JSON. No markdown fences.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY 
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const resume = JSON.parse(cleaned);

    clearInterval(loadInterval);
    document.getElementById('loadingOverlay').style.display = 'none';
    renderResume(resume);
    document.getElementById('resumeOutput').style.display = 'block';

  } catch (err) {
    clearInterval(loadInterval);
    alert('Something went wrong. Please try again.');
    goBack();
    document.getElementById('step1').style.display = 'block';
  }
}

// ─── RENDER RESUME ─────────────────────────────────────────────
function renderResume(r) {
  const expHTML = (r.experience || []).map(e => `
    <div class="r-exp-item">
      <div class="r-exp-top">
        <div>
          <div class="r-role">${e.role}</div>
          <div class="r-company">${e.company}</div>
        </div>
        <div class="r-duration">${e.duration}</div>
      </div>
      <ul class="r-bullets">
        ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>`).join('');

  const skillsHTML = (r.skills || []).map(s => `<span class="r-skill-tag">${s}</span>`).join('');

  const eduHTML = (r.education || []).map(e => `
    <div class="r-edu-row">
      <div>
        <div class="r-degree">${e.degree}</div>
        <div class="r-school">${e.school}</div>
      </div>
      <div class="r-year">${e.year}</div>
    </div>`).join('');

  const certHTML = r.certifications && r.certifications.length ? `
    <div class="r-section-title">Certifications</div>
    <ul class="r-cert-list">
      ${r.certifications.map(c => `<li>${c}</li>`).join('')}
    </ul>` : '';

  document.getElementById('resumePaper').innerHTML = `
    <div class="r-header">
      <div class="r-name">${r.name}</div>
      <div class="r-desig">${r.designation}</div>
      <div class="r-contacts">
        <span class="r-contact-item">📧 ${r.email}</span>
        <span class="r-contact-item">📱 ${r.phone}</span>
        <span class="r-contact-item">📍 ${r.location}</span>
        <span class="r-contact-item">🔗 ${r.linkedin}</span>
      </div>
    </div>
    <div class="r-section-title">Professional Summary</div>
    <p class="r-summary">${r.summary}</p>
    <div class="r-section-title">Work Experience</div>
    ${expHTML}
    <div class="r-section-title">Skills</div>
    <div class="r-skills">${skillsHTML}</div>
    <div class="r-section-title">Education</div>
    ${eduHTML}
    ${certHTML}
  `;
}

// ─── EDIT MODE ─────────────────────────────────────────────────
let isEditing = false;

function toggleEdit() {
  isEditing = !isEditing;
  const paper = document.getElementById('resumePaper');
  const btn   = document.getElementById('editToggle');

  if (isEditing) {
    paper.classList.add('edit-mode');
    const banner = document.createElement('div');
    banner.className = 'edit-banner';
    banner.id = 'editBanner';
    banner.textContent = '✏ Click on any text to edit it. Click "Save edits" when done.';
    document.getElementById('resumeOutput').insertBefore(banner, paper);

    const selectors = [
      '.r-name', '.r-desig', '.r-contact-item', '.r-summary',
      '.r-role', '.r-company', '.r-duration', '.r-degree',
      '.r-school', '.r-year', '.r-skill-tag', '.r-cert-list li'
    ];
    selectors.forEach(sel => {
      paper.querySelectorAll(sel).forEach(el => {
        el.contentEditable = 'true';
        el.spellcheck = true;
      });
    });
    paper.querySelectorAll('.r-bullets li').forEach(el => {
      el.contentEditable = 'true';
      el.spellcheck = true;
    });
    btn.textContent = '💾 Save edits';
    btn.classList.add('active-tool');
  } else {
    paper.classList.remove('edit-mode');
    paper.querySelectorAll('[contenteditable]').forEach(el => {
      el.contentEditable = 'false';
    });
    const banner = document.getElementById('editBanner');
    if (banner) banner.remove();
    btn.textContent = '✏ Edit resume';
    btn.classList.remove('active-tool');
  }
}

// ─── DOWNLOAD PDF ──────────────────────────────────────────────
function downloadResume() {
  const originalTitle = document.title;
  const name = document.querySelector('.r-name');
  if (name) document.title = name.textContent + ' - Resume';
  const wasEditing = isEditing;
  if (wasEditing) toggleEdit();
  window.print();
  document.title = originalTitle;
}
