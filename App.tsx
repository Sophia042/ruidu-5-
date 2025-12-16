import React, { useState, useEffect } from 'react';
import { generateAppImage, generateComparisonImage, generateNozzleComparisonImage } from './services/gemini';

// --- ICONS (Rich, Bold Style) ---
const Icons = {
  ArrowRight: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>,
  Cross: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>,
  Play: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Phone: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>,
  Compass: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Zap: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Eye: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  DownArrow: () => <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  PenTool: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Drop: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Target: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
  Move: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>,
  Cube: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
};

// --- DATA ---

const SINGLE_NOZZLE_FEATURES = [
  {
    title: "矢量共形打印",
    desc: "非光栅式扫描。RUIDU 算法控制喷头沿叶片曲面法线进行矢量绘制，边缘平滑度提升 300%，无台阶效应。",
    color: "text-rose-600",
    borderSide: "border-l-rose-500",
    bgHover: "hover:bg-rose-50"
  },
  {
    title: "高粘度兼容",
    desc: "航空银浆粘度高 (>20cP)。单喷头气动/压电混合驱动结构，提供比 MEMS 喷头更大的推力，杜绝堵头。",
    color: "text-blue-600",
    borderSide: "border-l-blue-500",
    bgHover: "hover:bg-blue-50"
  },
  {
    title: "激光测距反馈",
    desc: "集成微型激光位移传感器。以 2kHz 频率扫描前方地形，实时调整 Z 轴高度，保持喷射距离恒定 (Standoff Height)。",
    color: "text-cyan-600",
    borderSide: "border-l-cyan-500",
    bgHover: "hover:bg-cyan-50"
  }
];

const APP_SCENARIOS = [
  {
    id: 'vr',
    title: 'AR/VR 光波导',
    subtitle: '曲面微纳直写制造',
    desc: '在 AR/VR 智能眼镜的制造中，如何在不规则的曲面镜片上集成光波导是一个巨大挑战。睿度的五轴联动单喷头喷墨技术，能够完美贴合镜片曲率，直接打印液晶材料，构建高性能体全息波导。',
    features: [
      '非接触式制造',
      '适配任意复杂曲面',
      '降低定制成本'
    ],
    theme: 'blue'
  },
  {
    id: 'aerospace',
    title: '航空精密器件',
    subtitle: '涡轮叶片 · 温度传感器',
    desc: '突破传统贴片工艺限制，利用五轴联动技术在涡轮叶片等复杂曲面直接打印耐高温薄膜传感器。能够在发动机高温、高压、高转速的极端工况下，精准捕获表面温度场与应变数据，实现核心部件的实时健康监测与全生命周期管理。',
    features: [
      '耐高温原位制造',
      '实时健康监测',
      '微米级共形贴合'
    ],
    theme: 'orange' // Updated color theme
  },
  {
    id: 'bio',
    title: '柔性脑机接口',
    subtitle: '高密度微电极阵列',
    desc: '在柔性基底（如 PI、FPCB）上构建高密度微电极阵列。采用 PEDOT:PSS 等导电聚合物，降低阻抗，睿度的微纳打印技术解决了传统刚性电极与柔软脑组织之间的机械失配问题，能够制造出顺应性极佳的神经探针。',
    features: [
      '高生物相容性',
      '柔性基底直写',
      '细胞支架构建'
    ],
    theme: 'purple'
  }
];

const TESTIMONIALS = [
  {
    quote: "利用五轴联动系统在曲面透镜上直接打印功能材料，突破了传统平面工艺的限制，显著提升了光波导器件的性能。",
    role: "光学研发总监",
    org: "头部 AR 智能眼镜制造商",
    tag: "消费电子",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    quote: "矢量共形打印技术解决了在复杂曲率叶片上集成传感器的难题，实现了功能器件与结构件的一体化制造，在恶劣工况下表现优异。",
    role: "高级工程师",
    org: "某航空发动机研究院",
    tag: "航空航天",
    color: "bg-orange-50 text-orange-700 border-orange-200"
  },
  {
    quote: "在极软生物基底上的高精度直写能力令人印象深刻，为柔性神经电极阵列的构建提供了创新的制造手段。",
    role: "课题组负责人 (PI)",
    org: "前沿神经工程实验室",
    tag: "生物医疗",
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
];

// Updated Specs Data with sub-values for multiline display
const STARFISH_SPECS = [
    { label: "重复定位精度", value: "±20μm" },
    { label: "最大运动速度", value: "100mm/s" },
    { label: "标准工作行程", value: "300×300×100mm", subValue: "(UV 180°×360°)" },
    { label: "视觉系统", value: "双相机", subValue: "液滴观测 + Mark点" },
    { label: "加工效率", value: "单次装夹", subValue: "多面加工" },
];

// --- COMPONENTS ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between">
        {/* LEFT: Logo & Slogan */}
        <div className="flex items-center gap-4">
           {/* RUIDU Custom Logo (SVG) based on Molecule reference */}
           <div className="text-blue-500">
             <svg className="w-12 h-12" viewBox="0 0 60 40" fill="none">
                {/* Top Row Nodes */}
                <circle cx="10" cy="12" r="5" fill="currentColor" />
                <path d="M15 12 H 25" stroke="currentColor" strokeWidth="3" />
                <circle cx="30" cy="12" r="5" fill="currentColor" />
                <path d="M35 12 H 45" stroke="currentColor" strokeWidth="3" />
                <circle cx="50" cy="12" r="6" fill="currentColor" />

                {/* Vertical Connection */}
                <path d="M30 17 V 27" stroke="currentColor" strokeWidth="3" />
                
                {/* Bottom Row Node */}
                <circle cx="30" cy="32" r="5" fill="currentColor" />
                
                {/* Angled Connection */}
                <path d="M34 35 L 45 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="45" r="7" fill="currentColor" />
             </svg>
           </div>
           
           <div className="flex flex-col">
              <div className="flex items-baseline gap-3">
                 <span className="text-3xl font-black text-blue-500 tracking-tight leading-none">RUIDU</span>
                 <span className="text-sm text-slate-400 tracking-widest font-light border-l border-slate-700 pl-3">
                   高精度五轴
                 </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">
                Single Nozzle Micro-Dispensing
              </span>
           </div>
        </div>
        
        {/* RIGHT: Navigation */}
        <div className="hidden lg:flex items-center gap-12">
           {['首页', '产品中心', '解决方案', '应用', '技术'].map((item, index) => (
             <a key={index} href="#" className={`text-sm font-bold tracking-wider transition-all duration-300 relative group py-2 ${index === 0 ? 'text-blue-400' : 'text-slate-300 hover:text-white'}`}>
               {item}
               {index === 0 && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>}
               {index !== 0 && <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>}
             </a>
           ))}
        </div>
      </div>
    </nav>
  );
};

// Merged Tech Deep Dive Section
const TechDeepDive = () => {
  const [images, setImages] = useState<{distance: string | null, anamorphosis: string | null}>({distance: null, anamorphosis: null});

  useEffect(() => {
      const loadImages = async () => {
          const comparison1 = await generateComparisonImage('distance');
          const comparison2 = await generateComparisonImage('anamorphosis');
          setImages({ distance: comparison1, anamorphosis: comparison2 });
      };
      loadImages();
  }, []);

  return (
    <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">核心挑战：为何曲面打印很难？</h2>
                {/* REMOVED SEPARATOR LINE */}
                <p className="text-slate-500 max-w-2xl text-lg leading-relaxed mx-auto font-medium">
                    平面打印是“墨水落在平地上”，而曲面打印是“墨水精准投递到移动且不规则的立体目标上”，技术难度呈几何级数增长。
                </p>
            </div>

            {/* PART 1: The Challenges (Visual Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Throw Distance */}
                 <div className="group border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                     <div className="h-64 bg-slate-200 relative overflow-hidden">
                         {images.distance ? (
                            <img src={images.distance} alt="Throw distance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         ) : <div className="w-full h-full animate-pulse bg-slate-200"></div>}
                         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-extrabold text-slate-900 border border-slate-200 uppercase tracking-wide rounded-sm shadow-sm">
                            物理极限 01
                         </div>
                     </div>
                     <div className="p-10">
                         <h3 className="text-2xl font-bold text-slate-900 mb-4">大射程 (Throw Distance) 问题</h3>
                         <p className="text-slate-600 text-base leading-relaxed">
                            普通喷墨要求喷头距离介质 &lt;2mm。曲面制造因结构避让需要 <strong>5-20mm</strong> 的高射程，这要求特殊的波形控制以保证液滴直线飞行不散点。
                         </p>
                     </div>
                 </div>

                 {/* Anamorphosis */}
                 <div className="group border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                     <div className="h-64 bg-slate-800 relative overflow-hidden">
                         {images.anamorphosis ? (
                            <img src={images.anamorphosis} alt="Anamorphosis" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                         ) : <div className="w-full h-full animate-pulse bg-slate-800"></div>}
                         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-extrabold text-slate-900 border border-slate-200 uppercase tracking-wide rounded-sm shadow-sm">
                            几何难题 02
                         </div>
                     </div>
                     <div className="p-10">
                         <h3 className="text-2xl font-bold text-slate-900 mb-4">投影变形 (Anamorphosis)</h3>
                         <p className="text-slate-600 text-base leading-relaxed">
                            将2D平面图案直接投影到3D曲面会导致严重拉伸变形。我们的算法采用逆向畸变补偿技术，确保最终产品上的图案完美还原设计原貌。
                         </p>
                     </div>
                 </div>
            </div>
        </div>
    </section>
  );
};

// Single Nozzle Q&A Section - Redesigned
const SingleNozzleQA = () => {
  const [comparisonImg, setComparisonImg] = useState<string | null>(null);
  
  useEffect(() => {
    generateNozzleComparisonImage().then(setComparisonImg);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">为什么选择单喷头而非阵列喷头？</h2>
            <p className="text-slate-500 max-w-2xl text-lg leading-relaxed mx-auto font-medium">
                在精微制造领域，精度与材料适应性远比打印速度重要
            </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                
                {/* LEFT: Image & Comparison Text */}
                <div className="flex flex-col gap-6 h-full">
                    {/* Image */}
                    <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xl group h-64 w-full shrink-0">
                        {comparisonImg ? (
                            <img src={comparisonImg} alt="Single vs Multi Nozzle" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full animate-pulse bg-slate-200"></div>
                        )}
                    </div>

                    {/* Comparison List */}
                    <div className="flex flex-col gap-8 px-2 flex-grow justify-center">
                        {/* Red Cross Item */}
                        <div className="flex gap-4 items-start">
                             <div className="shrink-0 mt-1 text-red-500">
                                <Icons.Cross />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">传统阵列喷头</h4>
                                <p className="text-base text-slate-600 leading-relaxed">
                                    体积庞大，在复杂曲面上易发生机械干涉。其多个喷头间的空间位置偏差难以彻底校准，这种固有误差在非平面上会被放大，直接导致图案失真、线宽不均及功能界面匹配问题。
                                </p>
                            </div>
                        </div>

                        {/* Green Check Item */}
                        <div className="flex gap-4 items-start">
                             <div className="shrink-0 mt-1 text-green-500">
                                <Icons.Check />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">单喷头</h4>
                                <p className="text-base text-slate-600 leading-relaxed">
                                    如同灵巧的画笔，配合五轴联动系统，可深入复杂结构作业，从根源上消除了多喷头间的对齐误差与热膨胀差异，确保了在复杂曲面上的微米级定位精度与材料沉积一致性。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Feature Cards (No Icons, Aligned Height) */}
                <div className="flex flex-col justify-between gap-4 h-full">
                    {SINGLE_NOZZLE_FEATURES.map((item, i) => (
                        <div key={i} className={`group relative bg-white rounded-xl p-8 border border-slate-200 border-l-[6px] ${item.borderSide} shadow-md hover:shadow-xl transition-all duration-300 ${item.bgHover} flex-1 flex flex-col justify-center`}>
                             <div className="flex flex-col gap-2">
                                 <h3 className={`text-2xl font-black mb-2 text-slate-900 group-hover:${item.color} transition-colors`}>
                                     {item.title}
                                 </h3>
                                 <p className="text-base leading-loose text-slate-600 font-medium">
                                     {item.desc}
                                 </p>
                             </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </section>
  );
};

// Brand Philosophy / Manifesto
const BrandManifesto = () => {
  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-left md:max-w-4xl">
                <span className="text-blue-200 font-bold tracking-widest uppercase text-sm mb-2 block">企业使命</span>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                    承诺源于责任，创新驱动未来
                </h2>
                <p className="text-blue-100 text-xl font-medium opacity-90 leading-relaxed">
                    睿度科技始终坚持以技术创新履行企业责任，致力于为全球高端制造业提供最可靠的微纳制造解决方案。我们承诺每一台设备都代表着工业精度的最高标准，助力合作伙伴实现可持续的智造升级。
                </p>
            </div>
            <button className="whitespace-nowrap px-10 py-4 bg-white text-blue-700 font-bold text-sm tracking-widest uppercase rounded-full hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 shrink-0">
                了解更多
            </button>
        </div>
    </section>
  )
}


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(APP_SCENARIOS[1].id); // Default to Aerospace
  const [appImages, setAppImages] = useState<{[key: string]: string}>({});
  // NEW: State for Hero Carousel Images (Array of strings)
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    // Generate images for the scenarios + Lab for R&D card + Factory for Industrial card
    const loadImages = async () => {
        const vr = await generateAppImage('vr');
        const aero = await generateAppImage('aerospace'); // Turbine Blade
        const bio = await generateAppImage('bio');
        const lab = await generateAppImage('lab'); // University Lab
        const factory = await generateAppImage('factory'); // Factory Workshop
        
        // Use the generated app images for the hero carousel as well
        const heroImgs = [vr, aero, bio].filter(img => img !== null) as string[];

        setAppImages({ 
            vr: vr || '', 
            aerospace: aero || '', 
            bio: bio || '', 
            lab: lab || '',
            factory: factory || '' 
        });
        setHeroImages(heroImgs);
    };
    loadImages();
  }, []);

  // Hero Carousel Interval
  useEffect(() => {
      if (heroImages.length <= 1) return;
      
      const interval = setInterval(() => {
          setActiveHeroIndex(prev => (prev + 1) % heroImages.length);
      }, 5000); // Switch every 5 seconds

      return () => clearInterval(interval);
  }, [heroImages]);

  const currentApp = APP_SCENARIOS.find(a => a.id === activeTab) || APP_SCENARIOS[0];
  const currentAppIndex = APP_SCENARIOS.findIndex(a => a.id === activeTab);

  // Helper to get color class based on theme - Updated for Orange theme
  const getThemeColor = (theme: string) => {
      switch(theme) {
          case 'blue': return 'bg-blue-500 text-white shadow-blue-500/50';
          case 'cyan': return 'bg-cyan-500 text-white shadow-cyan-500/50';
          case 'purple': return 'bg-purple-600 text-white shadow-purple-600/50';
          case 'orange': return 'bg-orange-500 text-white shadow-orange-500/50';
          default: return 'bg-blue-500 text-white';
      }
  };
  
  // Revised icon color helper for Saturated, Filled look
  const getIconColorClasses = (theme: string) => {
      switch(theme) {
          case 'blue': return 'bg-blue-500 text-white shadow-lg shadow-blue-200';
          case 'cyan': return 'bg-cyan-500 text-white shadow-lg shadow-cyan-200';
          case 'purple': return 'bg-purple-600 text-white shadow-lg shadow-purple-200';
          case 'orange': return 'bg-orange-500 text-white shadow-lg shadow-orange-200';
          default: return 'bg-blue-500 text-white';
      }
  };
  
  const getTextColorClasses = (theme: string) => {
      switch(theme) {
          case 'blue': return 'text-blue-600 border-blue-500';
          case 'cyan': return 'text-cyan-600 border-cyan-500';
          case 'purple': return 'text-purple-600 border-purple-500';
          case 'orange': return 'text-orange-500 border-orange-500';
          default: return 'text-blue-600 border-blue-500';
      }
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* --- PAGE 1: HERO (Dark Tech Style with Carousel) --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
         {/* Background Image Carousel */}
         <div className="absolute inset-0 w-full h-full z-0">
            {heroImages.length > 0 ? (
                 heroImages.map((img, index) => (
                    <img 
                        key={index}
                        src={img} 
                        alt="RUIDU Micro-Dispensing Tech" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === activeHeroIndex ? 'opacity-70' : 'opacity-0'}`} 
                    />
                 ))
            ) : (
                <div className="w-full h-full bg-slate-900 animate-pulse"></div>
            )}
            
            {/* Vignette Overlay for focus */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80"></div>
         </div>

         {/* Content */}
         <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center mt-20">
             
             {/* Pill Label */}
             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md mb-8 group cursor-default hover:border-cyan-400/60 transition-colors">
                 <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase group-hover:text-cyan-300">FROM PLANAR TO SPATIAL</span>
                 <span className="w-[1px] h-3 bg-cyan-700"></span>
                 <span className="text-[10px] font-bold text-cyan-200 tracking-widest group-hover:text-white">从平面到空间</span>
             </div>
             
             {/* Headline - Single Line Centered */}
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight drop-shadow-2xl whitespace-nowrap">
                赋能曲面以<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">微米级</span>智慧
             </h1>
             
             {/* Description - Removed Top Line */}
             <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed mb-12 font-light tracking-wide mx-auto">
                 突破传统三轴限制。利用睿度五轴微纳平台，在任意复杂几何表面实现高精度共形打印，开启制造新维度。
             </p>
             
             {/* Buttons */}
             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                 <button className="px-10 py-4 bg-white text-slate-950 font-bold text-sm tracking-[0.15em] hover:bg-slate-200 transition-all uppercase rounded-sm flex items-center gap-2 group">
                     探索系统 
                     <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </button>
                 
                 <button className="px-10 py-4 border border-white/30 text-white font-bold text-sm tracking-[0.15em] hover:bg-white/10 hover:border-white transition-all uppercase rounded-sm flex items-center gap-3 group backdrop-blur-sm">
                     <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all">
                        <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                     </span>
                     观看演示
                 </button>
             </div>
         </div>
         
         {/* Bottom Arrow */}
         <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/30 animate-bounce">
             <Icons.DownArrow />
         </div>
      </section>

      {/* --- PAGE 2: APPLICATIONS (Tighter Layout, Richer Colors) --- */}
      <section className="py-24 relative bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
              
              {/* TITLE ADJUSTED SIZE - Now matches Core Challenge size */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">RUIDU能为您做些什么？</h2>
              </div>

              {/* Tabs */}
              <div className="flex flex-col items-center mb-12 text-center">
                  <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 shadow-inner">
                      {APP_SCENARIOS.map(app => {
                          const isActive = activeTab === app.id;
                          return (
                            <button 
                                key={app.id}
                                onClick={() => setActiveTab(app.id)}
                                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                    isActive 
                                    ? getThemeColor(app.theme) + ' transform scale-105' 
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                                }`}
                            >
                                {app.title.split(' ')[0]}
                            </button>
                          );
                      })}
                  </div>
              </div>

              {/* Layout Content - TIGHTER GAP (gap-8 instead of gap-16) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Left: Text Content - Tighter Spacing */}
                  <div className="order-2 lg:order-1 flex flex-col items-start space-y-6 lg:pr-6 animate-fadeIn">
                       <div className="space-y-3">
                           <div className="flex items-center gap-3">
                               <div className={`w-12 h-[4px] rounded-full ${currentApp.theme === 'orange' ? 'bg-orange-500' : currentApp.theme === 'purple' ? 'bg-purple-600' : 'bg-blue-500'}`}></div>
                               <span className={`font-black text-sm tracking-[0.2em] uppercase ${getTextColorClasses(currentApp.theme).split(' ')[0]}`}>
                                   APPLICATION CASE 0{currentAppIndex + 1}
                               </span>
                           </div>
                           
                           <div>
                               <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1] mb-2 tracking-tight">
                                   {currentApp.title}
                               </h3>
                               <span className="block text-slate-400 text-2xl font-light tracking-wide">
                                   {currentApp.subtitle}
                               </span>
                           </div>
                       </div>

                       <p className="text-slate-600 text-lg leading-relaxed font-medium">
                           {currentApp.desc}
                       </p>

                       <ul className="space-y-4 pt-4 w-full">
                           {currentApp.features?.map((feature, i) => (
                               <li key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-slate-300 transition-all">
                                   <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconColorClasses(currentApp.theme)}`}>
                                       <Icons.Check />
                                   </div>
                                   <span className="text-slate-800 font-bold text-base tracking-wide">{feature}</span>
                               </li>
                           ))}
                       </ul>
                       
                       <button className={`mt-4 px-10 py-5 rounded-xl text-white font-bold uppercase tracking-widest text-sm shadow-xl transition-transform hover:scale-105 ${
                           currentApp.theme === 'orange' ? 'bg-orange-500 hover:bg-orange-400' :
                           currentApp.theme === 'purple' ? 'bg-purple-600 hover:bg-purple-500' :
                           'bg-blue-600 hover:bg-blue-500'
                       }`}>
                           查看详细方案
                       </button>
                  </div>

                  {/* Right: Image Content */}
                  <div className="order-1 lg:order-2 h-full">
                      <div className="w-full h-full min-h-[500px] relative bg-slate-100 shadow-2xl overflow-hidden rounded-3xl border-4 border-white ring-1 ring-slate-200">
                          {appImages[currentApp.id] ? (
                              <img 
                                key={currentApp.id}
                                src={appImages[currentApp.id]} 
                                alt={currentApp.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                              />
                          ) : (
                              <div className="w-full h-full bg-slate-200 animate-pulse"></div>
                          )}
                          
                          {/* Rich Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t opacity-60 ${
                              currentApp.theme === 'orange' ? 'from-orange-900/80 via-transparent' :
                              currentApp.theme === 'purple' ? 'from-purple-900/80 via-transparent' :
                              'from-slate-900/80 via-transparent'
                          }`}></div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- PAGE 3: TECH DEEP DIVE --- */}
      <TechDeepDive />

      {/* --- PAGE 4: BRAND MANIFESTO --- */}
      <BrandManifesto />

      {/* --- PAGE 5: SINGLE NOZZLE Q&A (Symmetrical Layout) --- */}
      <SingleNozzleQA />

      {/* --- PAGE 6: PRODUCT SELECTION --- */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">如何选择适合您的产品？</h2>
                  {/* REMOVED SEPARATOR LINE */}
                  <p className="text-slate-500 max-w-2xl text-lg leading-relaxed mx-auto font-medium">
                      为科研探索和工业生产量身定制的解决方案
                  </p>
              </div>

              {/* Grid Layout - Completely Symmetrical, Background Images for Both */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
                   
                   {/* Card 1: STARFISH Research (Full Image Background) */}
                   <div className="h-[500px] relative rounded-3xl overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-500 border-4 border-white">
                       {/* Background Image */}
                       <div className="absolute inset-0 bg-slate-200">
                           {appImages.lab ? (
                               <img src={appImages.lab} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Laboratory" />
                           ) : null}
                       </div>
                       
                       {/* Dark Overlay for Text Legibility */}
                       <div className="absolute inset-0 bg-blue-900/60 group-hover:bg-blue-900/50 transition-colors duration-500"></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                       {/* Content */}
                       <div className="absolute inset-0 p-10 flex flex-col justify-between text-white z-10">
                           <div>
                               <div className="flex justify-between items-start mb-4">
                                   <h3 className="text-4xl font-black tracking-tight">科研平台</h3>
                                   <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/30 shadow-lg">STARFISH</span>
                               </div>
                               <p className="text-blue-200 font-bold text-sm uppercase tracking-wide mb-8 border-b border-white/20 pb-4 inline-block">高灵活性 · 开放架构</p>
                               
                               <div className="flex flex-wrap gap-3">
                                   {['五轴联动', '多种材料', '波形编辑'].map((item, i) => (
                                       <span key={i} className="text-xs font-bold text-white/90 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">{item}</span>
                                   ))}
                               </div>
                           </div>

                           <button className="w-full py-5 border border-white/40 hover:bg-white hover:text-blue-900 font-bold transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-xl mt-4 backdrop-blur-sm group-hover:bg-white group-hover:text-blue-900">
                               查看规格参数 <Icons.ArrowRight />
                           </button>
                       </div>
                   </div>

                   {/* Card 2: STARFISH Industrial (Full Image Background) */}
                   <div className="h-[500px] relative rounded-3xl overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-500 border-4 border-white">
                       {/* Background Image */}
                       <div className="absolute inset-0 bg-slate-800">
                           {appImages.factory ? (
                               <img src={appImages.factory} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Industrial Factory" />
                           ) : null}
                       </div>

                       {/* Dark Overlay */}
                       <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors duration-500"></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                       {/* Content */}
                       <div className="absolute inset-0 p-10 flex flex-col justify-between text-white z-10">
                           <div>
                               <div className="flex justify-between items-start mb-4">
                                   <h3 className="text-4xl font-black tracking-tight">量产产线</h3>
                                   <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-900/50 border border-blue-400">STARFISH PRO</span>
                               </div>
                               <p className="text-cyan-300 font-bold text-sm uppercase tracking-wide mb-8 border-b border-white/20 pb-4 inline-block">数字孪生 · 批量制造</p>
                               
                               <div className="flex flex-wrap gap-3">
                                   {['碰撞预警', '自动校准', '单次装夹'].map((item, i) => (
                                       <span key={i} className="text-xs font-bold text-white/90 bg-slate-900/40 px-4 py-2 rounded-full border border-slate-600 backdrop-blur-sm">{item}</span>
                                   ))}
                               </div>
                           </div>

                           <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-3 rounded-xl mt-4 shadow-lg shadow-blue-900/30">
                               量产方案 <Icons.ArrowRight />
                           </button>
                       </div>
                   </div>
              </div>

              {/* Redesigned Specs Bar - Full Width, No Border, Conspicuous Data */}
              <div className="bg-white border-y border-slate-200 py-16 w-full">
                 <div className="w-full px-4 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
                    {STARFISH_SPECS.map((spec, i) => (
                        <div key={i} className="flex flex-col items-center text-center flex-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{spec.label}</span>
                            <span className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight whitespace-nowrap">{spec.value}</span>
                            {spec.subValue && (
                                <span className="text-slate-500 text-sm font-bold mt-2 whitespace-nowrap">{spec.subValue}</span>
                            )}
                        </div>
                    ))}
                 </div>
              </div>
          </div>
      </section>

      {/* --- PAGE 7: TESTIMONIALS --- */}
      <section className="pt-0 pb-20 bg-white overflow-hidden border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 mb-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">行业领军者的选择</h2>
              {/* REMOVED SEPARATOR LINE */}
          </div>
          
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_li]:max-w-none animate-scroll">
                  {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                     <li key={i}>
                        <div className="w-[400px] bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 h-[220px] flex flex-col justify-between hover:bg-white hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="relative z-10">
                                <p className="text-slate-700 text-lg leading-snug font-medium">"{t.quote}"</p>
                            </div>
                            <div className="pt-4 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${t.tag === '科研研发' ? 'bg-blue-600' : t.tag === '航空航天' ? 'bg-orange-600' : t.tag === '消费电子' ? 'bg-blue-500' : 'bg-purple-600'}`}>
                                    {t.role.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">{t.role}</p>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{t.org}</p>
                                </div>
                            </div>
                        </div>
                     </li>
                  ))}
              </ul>
          </div>
      </section>

      {/* --- PAGE 8: CONTACT --- */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
                  <div className="pt-4"> {/* Added pt-4 to align with form top */}
                      <h2 className="text-5xl font-black text-white mb-8 tracking-tight">联系我们</h2>
                      <p className="text-slate-400 mb-12 text-lg leading-relaxed">
                          准备好升级您的制造能力了吗？欢迎您在9：00-17：30联系我们的工程师。
                      </p>
                      
                      <div className="space-y-10">
                           <div>
                               <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">公司地址</h3>
                               <p className="text-2xl font-medium text-white">中国 上海<br/><span className="text-slate-400 text-base font-normal">上海理工国家大学科技园 1号楼 B327</span></p>
                           </div>
                           <div className="space-y-6">
                               <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">联系方式</h3>
                               <div className="flex items-center gap-4 text-xl text-white group cursor-pointer">
                                   <div className="p-3 bg-slate-800 rounded-full group-hover:bg-blue-600 transition-colors"><Icons.Phone /></div> 
                                   <span>+86 21 51816409</span>
                                </div>
                                <div className="flex items-center gap-4 text-xl text-white group cursor-pointer">
                                   <div className="p-3 bg-slate-800 rounded-full group-hover:bg-blue-600 transition-colors"><Icons.Mail /></div>
                                   <span>service@rd-mv.com</span>
                                </div>
                           </div>
                      </div>
                  </div>
                  
                  <form className="space-y-6 bg-slate-900 p-12 rounded-3xl border border-slate-800 shadow-2xl">
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">姓名</label>
                          <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">公司/单位</label>
                          <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">邮箱</label>
                          <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">需求描述</label>
                          {/* Reduced height with h-20 */}
                          <textarea className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm mt-6 hover:translate-y-[-2px]">
                          发送留言
                      </button>
                  </form>
              </div>
          </div>
      </section>

      <footer className="py-12 bg-black text-slate-600 text-xs border-t border-slate-900">
          <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
              <p className="mb-4 md:mb-0 font-medium">&copy; 2024 睿度科技 (RUIDU TECHNOLOGY). 版权所有.</p>
              <div className="flex gap-8 font-bold tracking-wide">
                <a href="#" className="hover:text-blue-500 transition-colors">隐私政策</a>
                <a href="#" className="hover:text-blue-500 transition-colors">服务条款</a>
                <a href="#" className="hover:text-blue-500 transition-colors">网站地图</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default App;