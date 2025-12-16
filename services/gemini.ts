import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Rate Limiting Queue System ---
// To prevent "429 Resource Exhausted" errors, we queue all image generation requests
// and execute them sequentially with a delay.

let requestQueue: Promise<any> = Promise.resolve();

const enqueueRequest = <T>(
  requestFn: () => Promise<T>, 
  delayMs: number = 2000
): Promise<T | null> => {
  // Append the new request to the chain
  const nextRequest = requestQueue.then(async () => {
    // Artificial delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, delayMs));
    try {
      return await requestFn();
    } catch (error: any) {
      // Log warning but return null to prevent app crash
      if (error.status === 429 || error.code === 429 || (error.message && error.message.includes('429'))) {
        console.warn("Gemini API Rate Limit Hit (429). Returning null placeholder.");
        return null;
      }
      console.error("Gemini API Error:", error);
      return null;
    }
  });

  // Ensure the queue chain continues even if this request fails
  requestQueue = nextRequest.catch(() => {});
  
  return nextRequest;
};

const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
  return enqueueRequest(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  });
};

// --- Exported Functions ---

export const generateHeroImage = async (): Promise<string | null> => {
  const prompt = `
    Cinematic dark industrial background.
    Abstract close-up of a high-tech 5-axis silver metallic nozzle tip surrounded by mysterious dark blue and black soft gradients.
    Minimalist, sleek, premium aesthetic.
    Subtle hints of light reflection on the curved metal surface.
    4k resolution, dark mode web design background style.
  `;
  return generateImageFromPrompt(prompt);
};

export const generateTechContextImage = async (): Promise<string | null> => {
    const prompt = `
      Industrial visualization of a 6-axis robotic arm with a micro-dispensing head printing complex circuit patterns onto a curved motorcycle helmet or turbine blade.
      Clean white and silver machinery against a high-tech grey studio background.
      Blue holographic overlays showing the printing path and normal vectors.
      Photorealistic, 8k, unreal engine 5 render style.
    `;
    return generateImageFromPrompt(prompt);
  };

export const generateNozzleComparisonImage = async (): Promise<string | null> => {
    // UPDATED: Prompt to match the user's provided green nozzle image
    const prompt = `
      Extreme macro photography of a green micro-dispensing needle tip.
      The needle is vertical, tapering to a very fine point.
      It is dispensing or hovering over a translucent surface.
      The lighting is predominantly green/yellow, creating a scientific lab atmosphere.
      Shallow depth of field, focus on the needle tip.
      High resolution, authentic experimental photo style.
    `;
    return generateImageFromPrompt(prompt);
};

export const generateAppImage = async (type: 'aerospace' | 'bio' | 'vr' | 'lab' | 'factory'): Promise<string | null> => {
  let specificPrompt = "";
  
  if (type === 'aerospace') {
    // AVIATION TURBINE BLADE - UPDATED to match user image
    specificPrompt = `
      Black and white industrial photography of a metallic turbine wheel with multiple curved blades.
      Close-up shot showing intricate electronic circuit traces printed directly onto the surface of the blades.
      High contrast, metallic texture, precision engineering aesthetic.
      Monochromatic, silver and grey tones.
    `;
  } else if (type === 'bio') {
    // FLEXIBLE BCI
    specificPrompt = `
      Macro shot of a cutting-edge flexible brain-computer interface (BCI) sensor.
      A completely transparent, ultra-thin polymer film floating or resting on a glass surface.
      Visible gold and dark blue (PEDOT:PSS) micro-circuit traces forming a grid pattern.
      The background is a clean, sterile medical white/blue gradient.
      Extreme detail, scientific visualization style.
    `;
  } else if (type === 'vr') {
    // VR GLASSES
    specificPrompt = `
      Product photography of futuristic AR (Augmented Reality) smart glasses.
      The lens is the focal point, displaying a faint, rainbow-colored diffraction grating (waveguide) pattern.
      The frame is minimal and lightweight.
      Background is a high-tech laboratory environment, slightly blurred (bokeh).
      Crisp, clean, modern technology aesthetic.
    `;
  } else if (type === 'lab') {
    // UNIVERSITY LABORATORY (For Research Platform)
    specificPrompt = `
      Authentic university engineering laboratory setting.
      Cluttered but organized workbenches with microscopes, oscilloscopes, and a 5-axis 3D printer.
      Bright fluorescent lighting, white walls.
      A group of caucasian researchers (students/professors) in lab coats discussing data in the background.
      Realistic, candid academic research atmosphere.
    `;
  } else if (type === 'factory') {
    // SMART FACTORY (For Mass Production Line)
    specificPrompt = `
      Wide-angle interior shot of a modern smart factory workshop.
      Rows of identical high-tech white automated manufacturing machines.
      Clean, sterile, high-tech environment.
      Cool white lighting, polished floors, depth of field.
      Industry 4.0 concept.
    `;
  }

  const prompt = `
    ${specificPrompt}
    Award-winning photography, 8k resolution, highly detailed, cinematic lighting.
  `;
  return generateImageFromPrompt(prompt);
};

export const generateComparisonImage = async (type: 'distance' | 'anamorphosis'): Promise<string | null> => {
  const prompt = type === 'distance' 
    ? `Technical schematic cross-section of an industrial inkjet nozzle jetting a blue droplet across a large gap (20mm) onto a curved surface. Clean vector style diagram, white background, blue accents. Label 'Throw Distance'.`
    : `3D wireframe mesh of a complex bottle or cylinder on a computer screen, showing anamorphosis distortion grid. Dark UI, futuristic software interface, digital twin context.`;
  return generateImageFromPrompt(prompt);
};

// Keeping original exports for compatibility if needed
export const generateVRGlassesImage = async () => generateAppImage('vr');
export const generateCaseStudyImage = async (cat: string) => generateAppImage(cat === 'Aerospace' ? 'aerospace' : cat === 'Bio-Interface' ? 'bio' : 'vr');