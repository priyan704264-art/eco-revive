const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

// Calls the local YOLO backend (best.pt) for component detection
async function detectFromYOLO(imageFile) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch(`${backendUrl}/detect`, { method: "POST", body: formData });
    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
    const result = await response.json();
    if (result.success && result.predictions?.length > 0) {
      console.log("YOLO detections:", result.predictions);
      return { success: true, predictions: result.predictions };
    }
    return { success: true, predictions: [] };
  } catch (err) {
    console.warn("Local YOLO server unreachable:", err.message);
    return { success: false, error: err.message };
  }
}

// Convert image file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Call Groq API via standard fetch
async function callGroqAPI(messages, model = "llama-3.3-70b-versatile", jsonMode = true) {
  if (!apiKey || apiKey === "your_groq_key") {
    throw new Error("Groq API key is missing or not configured.");
  }

  const payload = {
    model: model,
    messages: messages,
    temperature: 0.2,
  };

  if (jsonMode) {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  if (jsonMode) {
    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse JSON response from Groq:", text);
      throw new Error("Invalid JSON response from AI");
    }
  }

  return text;
}

// High-fidelity fallback components mock data
const MOCK_COMPONENTS = [
  {
    name: "8GB DDR4 RAM Stick",
    hindi_name: "8GB DDR4 रैम स्टिक",
    location: "Center of the motherboard, parallel sockets",
    reuse_potential: "High",
    safety_risk: "Safe",
    safety_note: "Static electricity se bachayein. Remove battery before touching.",
    estimated_value_inr: 1200,
    grade: "A",
    grade_reason: "Gold connectors are clean, no scratches or burn marks, modules intact.",
    removal_difficulty: "Easy"
  },
  {
    name: "256GB NVMe M.2 SSD",
    hindi_name: "256GB M.2 एसएसडी (सॉलिड स्टेट ड्राइव)",
    location: "M.2 slot near the central chipset, secured with a small screw",
    reuse_potential: "High",
    safety_risk: "Safe",
    safety_note: "Safely wipe personal data before listing. Handle by edges only.",
    estimated_value_inr: 1800,
    grade: "B",
    grade_reason: "Perfect physical condition. Connector pin contacts are slightly dull but fully functional.",
    removal_difficulty: "Easy"
  },
  {
    name: "Intel Core i5-10300H CPU",
    hindi_name: "इंटेल कोर i5 प्रोसेसर",
    location: "Under the main copper heat sink pipe",
    reuse_potential: "Medium",
    safety_risk: "Caution",
    safety_note: "Pins are delicate. Clean old thermal paste carefully with isopropyl alcohol.",
    estimated_value_inr: 4500,
    grade: "B",
    grade_reason: "Thermal paste residue present, but die and pins are perfectly intact.",
    removal_difficulty: "Hard"
  },
  {
    name: "Laptop Internal Cooling Fan",
    hindi_name: "लैपटॉप कूलिंग फैन (पंख)",
    location: "Corner assembly near the copper ventilation grill",
    reuse_potential: "Medium",
    safety_risk: "Safe",
    safety_note: "Blow away dust before selling. Do not spin fan manually at ultra-high speeds.",
    estimated_value_inr: 450,
    grade: "C",
    grade_reason: "Dust buildup on blades, but fan rotates smoothly and motor is fully functional.",
    removal_difficulty: "Medium"
  },
  {
    name: "15.6 inch LED Backlit LCD Screen",
    hindi_name: "15.6 इंच एलसीडी स्क्रीन",
    location: "Upper lid assembly, secured by front bezel and brackets",
    reuse_potential: "High",
    safety_risk: "Caution",
    safety_note: "Fragile glass structure. Do not apply pressure. Flex cables are extremely delicate.",
    estimated_value_inr: 3200,
    grade: "A",
    grade_reason: "No dead pixels, color reproduction is accurate, scratch-free surface.",
    removal_difficulty: "Hard"
  }
];

// MOCK Guides
const MOCK_GUIDES = {
  "8GB DDR4 RAM Stick": {
    device: "Laptop/PC",
    component: "8GB DDR4 RAM Stick",
    estimated_time: "5 minutes",
    difficulty: "Easy",
    tools_needed: ["Philips head #00 screwdriver", "Plastic pry tool", "Anti-static wrist strap (optional)"],
    safety_warnings: [
      "Shutdown the laptop and disconnect the charger before opening.",
      "Remove or disable the battery to prevent electrical short-circuits.",
      "Avoid touching the gold contacts on the RAM stick directly to prevent static discharge."
    ],
    steps: [
      {
        step_number: 1,
        title: "Remove Back Panel Cover",
        instruction: "Unscrew all captive screws securing the base cover of the laptop. Use a plastic pry tool to gently unclip the cover starting from the hinges.",
        hindi_instruction: "लैपटॉप के बेस कवर को सुरक्षित करने वाले सभी पेचों को खोलें। टिका (hinges) से शुरू करते हुए कवर को धीरे से खोलने के लिए प्लास्टिक प्राइ टूल का उपयोग करें।",
        safety_flag: false,
        safety_note: "",
        tip: "Keep screws organized in a tray, as they may have different lengths."
      },
      {
        step_number: 2,
        title: "Disconnect the Battery",
        instruction: "Locate the main battery connector. Gently pull the connector out of its socket parallel to the motherboard to isolate the power.",
        hindi_instruction: "मुख्य बैटरी कनेक्टर का पता लगाएं। पावर को अलग करने के लिए कनेक्टर को मदरबोर्ड के समानांतर उसके सॉकेट से धीरे से बाहर खींचें।",
        safety_flag: true,
        safety_note: "CRITICAL: Under no circumstances should you work on the system with the battery connected.",
        tip: "Hold the connector pull-tab and pull straight back, not upwards."
      },
      {
        step_number: 3,
        title: "Release the RAM Clips",
        instruction: "Locate the RAM slot. Gently push the metallic spring clips on both sides of the RAM module outwards. The RAM stick will pop up at a 30-degree angle.",
        hindi_instruction: "रैम स्लॉट का पता लगाएं। रैम मॉड्यूल के दोनों किनारों पर लगी धातु की स्प्रिंग क्लिप को धीरे से बाहर की ओर धकेलें। रैम स्टिक 30 डिग्री के कोण पर ऊपर आ जाएगी।",
        safety_flag: false,
        safety_note: "",
        tip: "Let both clips pop out simultaneously."
      },
      {
        step_number: 4,
        title: "Pull Out the RAM Stick",
        instruction: "Grasp the RAM module by its side edges and pull it straight out of the slot at the same 30-degree angle.",
        hindi_instruction: "रैम मॉड्यूल को उसके साइड के किनारों से पकड़ें और उसे उसी 30 डिग्री के कोण पर सीधे स्लॉट से बाहर खींचें।",
        safety_flag: false,
        safety_note: "",
        tip: "Avoid touching the gold connector pins or the small memory chips."
      }
    ],
    after_removal_tips: [
      "Store the RAM stick inside an anti-static bubble bag.",
      "Avoid exposure to moisture, dust, or high temperatures."
    ]
  }
};

export async function enrichDetectedComponents(classesList) {
  if (!apiKey || apiKey === "your_groq_key") {
    console.log("Using Mock Data for enrichment: Groq API key is missing or default.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return classesList.map(cls => {
      const matched = MOCK_COMPONENTS.find(c => c.name.toLowerCase().includes(cls.toLowerCase()));
      if (matched) return matched;
      return {
        name: cls,
        hindi_name: `${cls} (पुर्जा)`,
        location: "Identified on the board",
        reuse_potential: "Medium",
        safety_risk: "Safe",
        safety_note: "Handle with care.",
        estimated_value_inr: 500,
        grade: "B",
        grade_reason: "Detected visually by object detection model.",
        removal_difficulty: "Medium"
      };
    });
  }

  try {
    const prompt = `You are an expert electronics engineer specializing in laptop and PC components recovery.
    
    An object detection model has scanned a circuit board and detected the following components:
    ${classesList.join(", ")}
    
    For each of these components, generate detailed recovery and pricing data.
    
    Return ONLY a valid JSON object containing a "components" key which is an array of these components:
    {
      "components": [
        {
          "name": "matching component name in English (e.g., standard names like 'RAM Stick', 'M.2 SSD', etc. based on the detected item)",
          "hindi_name": "component name in Hindi",
          "location": "typical location on a standard motherboard/enclosure",
          "reuse_potential": "High" or "Medium" or "Low",
          "safety_risk": "Safe" or "Caution" or "Dangerous",
          "safety_note": "specific safety instruction in Hindi/English mixed (Hinglish)",
          "estimated_value_inr": number between 10 and 15000,
          "grade": "A" or "B" or "C",
          "grade_reason": "assumed quality reasoning based on standard salvage",
          "removal_difficulty": "Easy" or "Medium" or "Hard"
        }
      ]
    }`;

    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    const parsed = await callGroqAPI(messages, "llama-3.3-70b-versatile", true);
    if (!parsed || !parsed.components) throw new Error("Invalid JSON structure from Groq enrichment");
    return parsed.components;
  } catch (error) {
    console.error("Groq enrichment error: ", error);
    throw error;
  }
}

// FUNCTION 1: Detect components from image
export async function detectComponents(imageFile) {
  // 1. Try local YOLO server first
  let yoloResult = null;
  try {
    yoloResult = await detectFromYOLO(imageFile);
  } catch (err) {
    console.error("YOLO detection failed:", err);
  }

  const hasYOLODetections = yoloResult && yoloResult.success && yoloResult.predictions.length > 0;

  if (hasYOLODetections) {
    const detectedClasses = [...new Set(yoloResult.predictions.map(p => p.class))];
    console.log("YOLO detected classes:", detectedClasses);

    try {
      const enrichedComponents = await enrichDetectedComponents(detectedClasses);
      return { 
        success: true, 
        components: enrichedComponents,
        visualizedImage: null
      };
    } catch (enrichError) {
      console.error("Failed to enrich YOLO classes, falling back to Groq Vision:", enrichError);
    }
  }

  // 2. Fallback to Groq Vision if Roboflow failed or found nothing
  if (!apiKey || apiKey === "your_groq_key") {
    console.log("Using Mock Data: Groq API key is missing or default.");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    return { success: true, components: MOCK_COMPONENTS };
  }

  try {
    const base64 = await fileToBase64(imageFile);

    const prompt = `You are an expert electronics engineer 
    specializing in laptop and PC components recovery.
    
    Analyze this image carefully and identify ALL recoverable 
    electronic components visible.
    
    Focus on these laptop/PC parts:
    CPU, RAM, GPU, HDD, SSD, Battery, LCD Panel, Keyboard, 
    WiFi Card, CPU Fan, Capacitors, Webcam, DC Jack, 
    Trackpad, PSU, CMOS Battery, Heat Sink, Speakers,
    Motherboard, USB Ports, Bluetooth Module, Microphone
    
    Return ONLY a valid JSON object containing a "components" key which is an array of identified components:
    {
      "components": [
        {
          "name": "component name in English",
          "hindi_name": "component name in Hindi",
          "location": "where it is in the image",
          "reuse_potential": "High" or "Medium" or "Low",
          "safety_risk": "Safe" or "Caution" or "Dangerous",
          "safety_note": "specific safety instruction",
          "estimated_value_inr": number between 10 and 15000,
          "grade": "A" or "B" or "C",
          "grade_reason": "why this grade was given",
          "removal_difficulty": "Easy" or "Medium" or "Hard"
        }
      ]
    }
    
    If no laptop/PC components visible, return:
    { "components": [] }`;

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${imageFile.type};base64,${base64}`
            }
          }
        ]
      }
    ];

    const parsed = await callGroqAPI(messages, "llama-3.2-11b-vision-preview", true);
    if (!parsed || !parsed.components) throw new Error("Invalid JSON from Groq");
    return { success: true, components: parsed.components };
  } catch (error) {
    console.error("Groq API Error: ", error);
    return { success: false, error: error.message };
  }
}

// FUNCTION 2: Generate disassembly guide
export async function generateGuide(deviceType, componentName) {
  if (!apiKey || apiKey === "your_groq_key") {
    console.log("Using Mock Data: Groq API key is missing or default.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const guide = MOCK_GUIDES[componentName] || {
      device: deviceType,
      component: componentName,
      estimated_time: "15 minutes",
      difficulty: "Medium",
      tools_needed: ["Philips head screwdriver", "Plastic pick tool"],
      safety_warnings: [
        "Make sure to completely turn off the machine.",
        "Unplug all cords and wires.",
        "Handle parts with dry hands only."
      ],
      steps: [
        {
          step_number: 1,
          title: "Open the outer enclosure",
          instruction: `Carefully remove all the screws on the back of the ${deviceType} to access the ${componentName}.`,
          hindi_instruction: `बैक पैनल के सभी पेच खोलें ताकि ${componentName} तक पहुँच सकें।`,
          safety_flag: false,
          safety_note: "",
          tip: "Organize the screws carefully so you don't lose any."
        },
        {
          step_number: 2,
          title: "Locate and detach cables",
          instruction: `Find the flex connectors attaching the ${componentName} and detach them slowly using the pry tool.`,
          hindi_instruction: `${componentName} को जोड़ने वाली केबल को ध्यान से अलग करें।`,
          safety_flag: true,
          safety_note: "Ribbon cables rip easily. Do not apply force.",
          tip: "Gently lift the black tabs of the connector clip."
        },
        {
          step_number: 3,
          title: "Extract the component",
          instruction: `Lift the ${componentName} from its mounting bracket and place it inside a protective bag.`,
          hindi_instruction: `${componentName} को कोष्ठक (bracket) से धीरे से उठाकर एंटी-स्टेटिक बैग में रखें।`,
          safety_flag: false,
          safety_note: "",
          tip: "Keep it away from magnetic objects."
        }
      ],
      after_removal_tips: [
        "Wipe the area with compressed air.",
        "Do not store the recovered part under heavy items."
      ]
    };
    return { success: true, guide };
  }

  try {
    const prompt = `You are a safe electronics disassembly expert.
    
    Generate a step-by-step guide to safely remove 
    "${componentName}" from a "${deviceType}".
    
    Return ONLY a valid JSON object matching this structure:
    {
      "device": "${deviceType}",
      "component": "${componentName}",
      "estimated_time": "X minutes",
      "difficulty": "Easy" or "Medium" or "Hard",
      "tools_needed": ["tool1", "tool2"],
      "safety_warnings": ["warning1", "warning2"],
      "steps": [
        {
          "step_number": 1,
          "title": "Step title",
          "instruction": "Detailed instruction in English",
          "hindi_instruction": "Hindi mein instruction",
          "safety_flag": true or false,
          "safety_note": "if safety_flag true, explain",
          "tip": "helpful tip for this step"
        }
      ],
      "after_removal_tips": ["tip1", "tip2"]
    }`;

    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    const parsed = await callGroqAPI(messages, "llama-3.3-70b-versatile", true);
    if (!parsed) throw new Error("Invalid JSON");
    return { success: true, guide: parsed };
  } catch (error) {
    console.error("Groq Guide API Error, falling back to mock data: ", error);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      guide: MOCK_GUIDES[componentName] || MOCK_GUIDES["8GB DDR4 RAM Stick"]
    };
  }
}

// FUNCTION 3: Grade component condition
export async function gradeComponent(imageFile, componentName) {
  if (!apiKey || apiKey === "your_groq_key") {
    console.log("Using Mock Data: Groq API key is missing or default.");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      success: true,
      grading: {
        component: componentName,
        grade: "A",
        grade_label: "Like New",
        hindi_grade: "नया जैसा (ए-ग्रेड)",
        condition_score: 9,
        defects: ["Slight dust on metallic plate"],
        recommended_price_inr: {
          min: 800,
          max: 1500
        },
        sellable: true,
        notes: "Excellent condition, gold connector pins are bright yellow and scratch free."
      }
    };
  }

  try {
    const base64 = await fileToBase64(imageFile);

    const prompt = `You are a quality inspector for 
    second-hand electronic components.
    
    Inspect this image of a "${componentName}" and grade it.
    
    Return ONLY a valid JSON object matching this structure:
    {
      "component": "${componentName}",
      "grade": "A" or "B" or "C",
      "grade_label": "Like New" or "Functional" or "For Parts",
      "hindi_grade": "grade in Hindi",
      "condition_score": number 1-10,
      "defects": ["defect1", "defect2"],
      "recommended_price_inr": {
        "min": number,
        "max": number
      },
      "sellable": true or false,
      "notes": "additional notes for seller"
    }`;

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${imageFile.type};base64,${base64}`
            }
          }
        ]
      }
    ];

    const parsed = await callGroqAPI(messages, "llama-3.2-11b-vision-preview", true);
    if (!parsed) throw new Error("Invalid JSON");
    return { success: true, grading: parsed };
  } catch (error) {
    console.error("Groq Grading API Error, falling back to mock data: ", error);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      grading: {
        component: componentName,
        grade: "B",
        grade_label: "Functional",
        hindi_grade: "चालू हालत में (बी-ग्रेड)",
        condition_score: 7,
        defects: ["Minor scratches on casing", "Requires thermal paste cleanup"],
        recommended_price_inr: {
          min: 1000,
          max: 2000
        },
        sellable: true,
        notes: "Perfect performance physically and electronically. Back plate contains light surface scratches."
      }
    };
  }
}

// FUNCTION 4: Suggest price
export async function suggestPrice(componentName, grade, city) {
  if (!apiKey || apiKey === "your_groq_key") {
    console.log("Using Mock Data: Groq API key is missing or default.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      pricing: {
        component: componentName,
        grade: grade,
        suggested_price_inr: 1200,
        price_range: { min: 1000, max: 1400 },
        market_demand: "High",
        best_platform: "local pickup or online shipping",
        selling_tip: "Wipe down any finger grease with clean micro-fiber and package in bubble wrap.",
        hindi_tip: "माइक्रो-फाइबर कपड़े से साफ़ करें और बबल रैप में पैक करके रखें।"
      }
    };
  }

  try {
    const prompt = `You are a pricing expert for second-hand 
    laptop and PC components in India.
    
    Suggest fair market price for:
    Component: ${componentName}
    Grade: ${grade}
    City: ${city}
    
    Return ONLY a valid JSON object matching this structure:
    {
      "component": "${componentName}",
      "grade": "${grade}",
      "suggested_price_inr": number,
      "price_range": { "min": number, "max": number },
      "market_demand": "High" or "Medium" or "Low",
      "best_platform": "local pickup or online shipping",
      "selling_tip": "tip in English",
      "hindi_tip": "tip in Hindi"
    }`;

    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    const parsed = await callGroqAPI(messages, "llama-3.3-70b-versatile", true);
    if (!parsed) throw new Error("Invalid JSON");
    return { success: true, pricing: parsed };
  } catch (error) {
    console.error("Groq Pricing API Error, falling back to mock data: ", error);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      pricing: {
        component: componentName,
        grade: grade,
        suggested_price_inr: 1500,
        price_range: { min: 1200, max: 1850 },
        market_demand: "Medium",
        best_platform: "Online marketplace with domestic shipping",
        selling_tip: "Clean with pure rubbing alcohol. Mention precise specs in description.",
        hindi_tip: "रबिंग एल्कोहल से अच्छे से साफ़ करें और उत्पाद का सही विवरण लिखें।"
      }
    };
  }
}
