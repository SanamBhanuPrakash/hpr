import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLeadSubmit } from "../hooks/useLeadSubmit";
import { validateEmail, validatePhone } from "../lib/validators";
import { useRequestPriceModal } from "../context/RequestPriceModalContext";
import SEO from "../components/seo/SEO";
import {
  Building2,
  Home,
  CheckCircle,
  Phone,
  Mail,
  PlayCircle,
  MapPin,
  Download,
  Trees,
  Heart,
  Leaf,
  Dumbbell,
  PartyPopper,
  Target,
  Armchair,
  Map,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Shield,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2, // ✅ FIX: add Shield import
} from "lucide-react";

/** ✅ HERO CAROUSEL (Slide 2 has embedded form) */
function VillaHeroCarousel({ onContactClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      id: 1,
      image: "/images/villa1.webp",
      badge: "SUSTAINABLE BY NATURE",
      title:
        "Shades of Green: Spacious 4BHK Villas for a Calmer North Bengaluru Life",
      subtitle:
        "An exclusive gated community off Hennur, near New Airport Road, designed with courtyards, open terraces, and airy volumes that make everyday living feel effortless.",
      rightPanel: null,
      showButton: true,
    },
    {
      id: 2,
      image: "/images/Villa2.webp",
      badge: "83 Exclusive Residences",
      title: "North Bengaluru's Most Exclusive 4BHK Villa Community",
      subtitle:
        "Escape the city clutter. Shades of Green offers expansive courtyard layouts, open terraces, and absolute privacy, perfectly located just minutes from the New Airport Road corridor.",
      rightPanel: null,
      showButton: false,
      // <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
      //   <h3 className="text-2xl font-bold text-gray-900 mb-6">
      //     Get in Touch
      //   </h3>
      //   <form className="space-y-4">
      //     <input
      //       type="text"
      //       placeholder="Full Name"
      //       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      //     />
      //     <input
      //       type="email"
      //       placeholder="Email Address"
      //       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      //     />
      //     <input
      //       type="tel"
      //       placeholder="Phone Number"
      //       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      //     />
      //     <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600">
      //       <option>I'm interested in...</option>
      //       <option>Villa Details</option>
      //       <option>Site Visit</option>
      //       <option>Pricing Information</option>
      //       <option>Floor Plans</option>
      //     </select>
      //     <button
      //       type="submit"
      //       className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
      //     >
      //       Submit Inquiry
      //     </button>
      //   </form>
      // </div>
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 650);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 650);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 650);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
      <div className="relative w-full h-screen">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt="Villa Background"
                className="w-full h-full object-cover"
                {...(index === 0 ? { fetchpriority: "high" } : { loading: "lazy" })}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
              <div
                className={`w-full grid ${
                  slide.rightPanel ? "lg:grid-cols-2 gap-12" : "grid-cols-1"
                } items-center`}
              >
                {/* Left Content */}
                <div className="text-white space-y-6 max-w-4xl">
                  {slide.badge && (
                    <span className="inline-block px-4 py-2 bg-[#1A4744] backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {slide.badge}
                    </span>
                  )}

                  <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-snug md:leading-tight lg:leading-[1.2]">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
                    {slide.subtitle}
                  </p>

                  {index === 0 && currentSlide === 0 && (
                    <button
                      onClick={onContactClick}
                      className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#1A4744] text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 font-semibold text-base sm:text-lg shadow-xl absolute bottom-24 sm:static"
                    >
                      Contact Us
                    </button>
                  )}
                </div>

                {/* Right Panel (only on slide 2) */}
                {slide.rightPanel && (
                  <div className="flex justify-start lg:justify-end">
                    {slide.rightPanel}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-[#1A4744]"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

const ShadesOfGreenLanding = () => {
  const navigate = useNavigate();
  const { submit: submitLead } = useLeadSubmit();
  const { open: openRequestPriceModal } = useRequestPriceModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lets nav links from other pages (e.g. /#gallery from the Thank You
  // page's header) land on the right section — client-side route changes
  // don't trigger the browser's native hash-scroll on their own.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, []);

  //For popup
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 3000) {
  //       setShowPopup(true);
  //       window.removeEventListener("scroll", handleScroll);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      openRequestPriceModal();
    }, 120000); // 120,000 milliseconds = 2 minutes

    return () => clearTimeout(timer); // Clears timer if component unmounts
  }, [openRequestPriceModal]);

  const scrollToContact = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/shadesofgreen-form/submit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await res.json();

  //     if (res.ok && data.success) {
  //       alert("Inquiry submitted successfully!");

  //       setFormData({
  //         name: "",
  //         email: "",
  //         phone: "",
  //         interest: "",
  //         message: "",
  //       });
  //     } else {
  //       alert(data.message || "Failed to submit inquiry");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Server error. Please try again.");
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...formData,
      [name]: value,
    }));

    // Clear error for field being edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validation check before API call
    if (!validateForm()) {
      return;
    }

    const ok = await submitLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      interest: formData.interest,
      message: formData.message,
      source: "form",
    });

    if (ok) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
      setFormErrors({});
      navigate("/thank-you");
    } else {
      setSubmitError("Failed to submit inquiry. Please try again.");
    }
  };

  const galleryImages = [
    {
      // name: "Villa Exterior",
      name: "Entrance Arch",
      url: "/images/Entrance Animation_Interactive LightMix0000.jpg",
    },
    {
      // name: "Courtyard View",
      name: "15000 sq. Ft. Clubhouse",
      url: "/images/Clubhouse entrance view.png",
    },
    {
      // name: "Clubhouse",
      name: "Swimming Pool",
      url: "/images/Swimming Pool_Interactive LightMix0058.jpg",
    },
    {
      // name: "Landscape",
      name: "Outdoor Activities",
      url: "/images/Outdoor Activities.jpg",
    },
    {
      // name: "Terrace Space",
      name: "Pickleball Court",
      url: "/images/Pickleball court.jpg",
    },
    {
      // name: "Community Area",
      name: "Children's Park",
      url: "/images/CPA_interactive light mix0000.jpg",
    },
    {
      // name: "Interior Design",
      name: "Gym",
      url: "/images/GYM_CShading_LightMix0000.jpg",
    },
    {
      // name: "Green Spaces",
      name: "Multipurpose Hall",
      url: "/images/MULTIPURPOSE HALL0042.jpg",
    },
  ];

  // const amenities = [
  //   {
  //     icon: Armchair,
  //     title: "Clubhouse",
  //     desc: "Social, fitness, and community time in one place.",
  //   },
  //   {
  //     icon: Target,
  //     title: "Outdoor Sports",
  //     desc: "Badminton, pickleball, and a cricket pitch.",
  //   },
  //   {
  //     icon: Trees,
  //     title: "Parks for All",
  //     desc: "Children's park, pet park, reflexology park.",
  //   },
  //   {
  //     icon: Dumbbell,
  //     title: "Outdoor Wellness",
  //     desc: "Outdoor gym and walkways for routine movement.",
  //   },
  // ];

  const amenitiesCategoryData = [
    {
      id: "clubhouse",
      title: "Clubhouse",
      icon: Armchair,
      shortDesc: "Social, fitness, and community time in one place.",
      detailedItems: [
        "Swimming Pool",
        "Kids Pool",
        "Library",
        "Co working Space",
        "Multipurpose Hall/Banquet Hall",
        "Yoga/Meditation Room",
        "Indoor Games",
        "Gym",
        "3 Guest Rooms",
        "Large Terrace Party Area",
      ],
    },
    {
      id: "outdoor-sports",
      title: "Outdoor Sports",
      icon: Target,
      shortDesc: "Badminton, pickleball, and a cricket pitch.",
      detailedItems: [
        "Basketball Court",
        "Pickleball Court",
        "Cricket Pitch",
        "Water Pond",
        "Outdoor Gym",
      ],
    },
    {
      id: "parks",
      title: "Parks for All",
      icon: Trees,
      shortDesc: "Children's park, pet park, reflexology park.",
      detailedItems: [
        "Pet Park",
        "Children's Park",
        "Reflexology Park",
        "Landscape Garden",
        "Walking/Jogging Pathway",
      ],
    },
    {
      id: "wellness",
      title: "Outdoor Wellness",
      icon: Dumbbell,
      shortDesc: "Outdoor gym and walkways for routine movement.",
      detailedItems: [
        "Rainwater Harvesting",
        "24/7 Security",
        "CCTV Surveillance",
        "Entrance Arch",
        "Brick Cladded Exterior",
        "Compound Wall",
        "Underground Water Tank",
        "STP",
        "Power and Water Supply to each Villa",
        "Uderground Drainage",
      ],
    },
  ];

  // 1. Define filters and data array
  const filters = ["EAST VILLA", "WEST VILLA"];

  const data = [
    { category: "EAST VILLA", image: "images/E1.png" },
    { category: "EAST VILLA", image: "images/E2.png" },
    { category: "EAST VILLA", image: "images/E3.png" },
    { category: "EAST VILLA", image: "images/E4.jpg" },
    { category: "EAST VILLA", image: "images/E5.png" },

    { category: "WEST VILLA", image: "images/W1.png" },
    { category: "WEST VILLA", image: "images/W3.png" },
    { category: "WEST VILLA", image: "images/W2.png" },
    { category: "WEST VILLA", image: "images/W4.png" },
    { category: "WEST VILLA", image: "images/W5.png" },
  ];

  // 2. Component States
  const [active, setActive] = useState("EAST VILLA");
  const [selectedPlanImage, setSelectedPlanImage] = useState(null);
  const [planScale, setPlanScale] = useState(1);

  // 3. Filtering Logic (memoized so filter clicks are smooth and lag-free)
  const filteredData = useMemo(() => {
    if (active === "All") return data;
    return data.filter((item) => item.category === active);
  }, [active]);

  // 4. Filter Button Handler
  const handleClick = (item) => {
    if (item !== active) {
      setActive(item);
    }
  };

  // 5. Lightbox Modal & Zoom Handlers

  // --- Floor Plan Panning States & Ref ---
  const [planPos, setPlanPos] = useState({ x: 0, y: 0 });
  const [isDraggingPlan, setIsDraggingPlan] = useState(false);
  const [planDragStart, setPlanDragStart] = useState({ x: 0, y: 0 });

  const planContainerRef = useRef(null);

  // --- Updated Floor Plan Lightbox & Clamped Zoom Handlers ---
  const openPlanModal = (imageSrc) => {
    setSelectedPlanImage(imageSrc);
    setPlanScale(1);
    setPlanPos({ x: 0, y: 0 });
  };

  const closePlanModal = () => {
    setSelectedPlanImage(null);
    setPlanScale(1);
    setPlanPos({ x: 0, y: 0 });
    setIsDraggingPlan(false);
  };

  const handlePlanZoomIn = () =>
    setPlanScale((prev) => Math.min(prev + 0.5, 4));

  const handlePlanZoomOut = () => {
    setPlanScale((prev) => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) setPlanPos({ x: 0, y: 0 });
      return nextScale;
    });
  };

  const handlePlanResetZoom = () => {
    setPlanScale(1);
    setPlanPos({ x: 0, y: 0 });
  };

  // Clamped Drag-to-Pan Logic for Floor Plans
  const handlePlanMouseDown = (e) => {
    if (planScale <= 1) return;
    e.preventDefault();
    setIsDraggingPlan(true);
    setPlanDragStart({
      x: e.clientX - planPos.x,
      y: e.clientY - planPos.y,
    });
  };

  const handlePlanMouseMove = (e) => {
    if (!isDraggingPlan || planScale <= 1 || !planContainerRef.current) return;
    e.preventDefault();

    const container = planContainerRef.current.getBoundingClientRect();
    const img = planContainerRef.current.querySelector("img");

    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    // Calculate actual rendered dimensions inside object-contain
    const containerAspect = container.width / container.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let actualRenderedWidth, actualRenderedHeight;

    if (imgAspect > containerAspect) {
      actualRenderedWidth = container.width;
      actualRenderedHeight = container.width / imgAspect;
    } else {
      actualRenderedHeight = container.height;
      actualRenderedWidth = container.height * imgAspect;
    }

    // Determine exact bounds based on actual image dimensions
    const maxX = Math.max(
      0,
      (actualRenderedWidth * planScale - container.width) / 2,
    );
    const maxY = Math.max(
      0,
      (actualRenderedHeight * planScale - container.height) / 2,
    );

    const rawX = e.clientX - planDragStart.x;
    const rawY = e.clientY - planDragStart.y;

    // Clamp coordinates strictly to rendered image boundaries
    setPlanPos({
      x: Math.min(Math.max(rawX, -maxX), maxX),
      y: Math.min(Math.max(rawY, -maxY), maxY),
    });
  };

  const handlePlanMouseUp = () => {
    setIsDraggingPlan(false);
  };

  const [isMasterPlanOpen, setIsMasterPlanOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [masterPlanPos, setMasterPlanPos] = useState({ x: 0, y: 0 });
  const [isDraggingMasterPlan, setIsDraggingMasterPlan] = useState(false);
  const [masterPlanDragStart, setMasterPlanDragStart] = useState({
    x: 0,
    y: 0,
  });

  const masterPlanContainerRef = useRef(null);

  const openMasterPlanModal = () => {
    setScale(1);
    setMasterPlanPos({ x: 0, y: 0 });
    setIsMasterPlanOpen(true);
  };

  const closeMasterPlanModal = () => {
    setIsMasterPlanOpen(false);
    setScale(1);
    setMasterPlanPos({ x: 0, y: 0 });
    setIsDraggingMasterPlan(false);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));

  const handleZoomOut = () => {
    setScale((prev) => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) setMasterPlanPos({ x: 0, y: 0 });
      return nextScale;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setMasterPlanPos({ x: 0, y: 0 });
  };

  // Strictly Bounded Drag Logic (Prevents dark space gaps)
  const handleMasterPlanMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDraggingMasterPlan(true);
    setMasterPlanDragStart({
      x: e.clientX - masterPlanPos.x,
      y: e.clientY - masterPlanPos.y,
    });
  };

  const handleMasterPlanMouseMove = (e) => {
    if (!isDraggingMasterPlan || scale <= 1 || !masterPlanContainerRef.current)
      return;
    e.preventDefault();

    const container = masterPlanContainerRef.current.getBoundingClientRect();
    const img = masterPlanContainerRef.current.querySelector("img");

    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    // Calculate actual rendered dimensions inside object-contain
    const containerAspect = container.width / container.height;
    const imageAspect = img.naturalWidth / img.naturalHeight;

    let renderedWidth, renderedHeight;

    if (imageAspect > containerAspect) {
      // Image is wider than container: constrained by width
      renderedWidth = container.width;
      renderedHeight = container.width / imageAspect;
    } else {
      // Image is taller than container: constrained by height
      renderedHeight = container.height;
      renderedWidth = container.height * imageAspect;
    }

    // Maximum distance image can pan before exposing background
    const maxX = Math.max(0, (renderedWidth * scale - container.width) / 2);
    const maxY = Math.max(0, (renderedHeight * scale - container.height) / 2);

    const rawX = e.clientX - masterPlanDragStart.x;
    const rawY = e.clientY - masterPlanDragStart.y;

    // Strict clamping: maxX remains 0 until zoomed width actually overflows container bounds
    setMasterPlanPos({
      x: Math.min(Math.max(rawX, -maxX), maxX),
      y: Math.min(Math.max(rawY, -maxY), maxY),
    });
  };

  const handleMasterPlanMouseUp = () => {
    setIsDraggingMasterPlan(false);
  };

  const [selectedAmenity, setSelectedAmenity] = useState(null);

 // Lead Modal States
  const [modalType, setModalType] = useState(null); // 'call' | 'brochure' | null
  const [showPhoneResult, setShowPhoneResult] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Error state for Brochure / Call Modal
  const [leadModalErrors, setLeadModalErrors] = useState({});
  const [leadModalFormError, setLeadModalFormError] = useState("");

  // Validation Logic for Brochure / Call Modal
  const validateLeadModal = () => {
    const errors = {};

    const emailError = validateEmail(email.trim());
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(phone.trim());
    if (phoneError) errors.phone = phoneError;

    setLeadModalErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleLeadSubmit = async (e) => {
    e.preventDefault();

    // Trigger validation before network call
    if (!validateLeadModal()) {
      return;
    }

    setLoading(true);
    setLeadModalFormError("");

    const requestType =
      modalType === "brochure" ? "brochure_download" : "request_call";

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/shadesofgreen-form/inquiry`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone, requestType }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Fire Meta Pixel Lead event
        if (typeof window.fbq === "function") {
          window.fbq("track", "Lead");
        }

        if (modalType === "brochure") {
          // Trigger automatic PDF brochure download
          const link = document.createElement("a");
          link.href = "/brochure.pdf";
          link.download = "Shades_of_Green_Brochure.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setShowDownloadSuccess(true);
        } else if (modalType === "call") {
          // Reveal contact phone number
          setShowPhoneResult(true);
        }
      } else {
        setLeadModalFormError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Lead Error:", err);
      setLeadModalFormError("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const redownloadBrochure = () => {
    const link = document.createElement("a");
    link.href = "/brochure.pdf";
    link.download = "Shades_of_Green_Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModal = () => {
    setModalType(null);
    setShowPhoneResult(false);
    setShowDownloadSuccess(false);
    setEmail("");
    setPhone("");
    setLeadModalErrors({});
    setLeadModalFormError("");
  };


  //Contact Form Validation
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Full Name is required.";
    }

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;

    if (!formData.interest) {
      errors.interest = "Please select an area of interest.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <SEO />
      {/* Inter is already loaded once, globally, via public/index.html +
          src/index.css's `body` rule — this used to also @import the same
          font a second time here, which both duplicated the fetch and used
          the slower @import loading path. */}
      <style>
        {`
          .hover-lift { transition: all 0.3s ease; }
          .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        `}
      </style>

      {/* Header */}
      {/* <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1A4744] shadow-lg py-3  "
            : "bg-[#1A4744] backdrop-blur-xl py-4 "
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/images/Logo3.png"
                alt="Shades of Green Logo"
                className="h-14 sm:h-15 md:h-16 w-auto object-contain"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              {[
                "Home",
                "Gallery",
                "Lifestyle",
                "Amenities",
                "Connectivity",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                  className="group relative text-[17px] font-semibold text-white hover:text-emerald-700 transition-colors"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a
                href="tel:+919187210414"
                className="hidden lg:inline-flex items-center gap-2 px-4 xl:px-6 py-2.5 bg-white text-black rounded-xl hover:bg-emerald-700 transition-colors font-semibold text-sm shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                +91 9187210414
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 pt-4">
              <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-4">
                <nav className="flex flex-col gap-2">
                  {[
                    "Home",
                    "Gallery",
                    "Lifestyle",
                    "Amenities",
                    "Connectivity",
                    "Contact",
                  ].map((item) => (
                    <a
                      key={item}
                      href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                      className="text-sm font-semibold text-gray-800 hover:text-emerald-700 hover:bg-emerald-50 transition-colors rounded-xl px-4 py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header> */}

      {/* <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1A4744] shadow-lg py-2.5"
            : "bg-[#1A4744] backdrop-blur-xl py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/images/Logo3.png"
                alt="Shades of Green Logo"
                className="h-12 sm:h-13 md:h-14 w-auto object-contain"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              {[
                "Home",
                "Gallery",
                "Lifestyle",
                "Amenities",
                "Connectivity",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                  className="group relative text-[16px] font-semibold text-white hover:text-emerald-700 transition-colors"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 xl:gap-4">
              <a
                href="tel:+919187210414"
                className="hidden lg:inline-flex items-center gap-2 px-3.5 xl:px-5 py-2 bg-white text-black rounded-xl hover:bg-emerald-700 transition-colors font-semibold text-xs xl:text-sm shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                +91 9187210414
              </a>


              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 pt-4">
              <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-4">
                <nav className="flex flex-col gap-2">
                  {[
                    "Home",
                    "Gallery",
                    "Lifestyle",
                    "Amenities",
                    "Connectivity",
                    "Contact",
                  ].map((item) => (
                    <a
                      key={item}
                      href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                      className="text-sm font-semibold text-gray-800 hover:text-emerald-700 hover:bg-emerald-50 transition-colors rounded-xl px-4 py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header> */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1A4744] shadow-lg py-2"
            : "bg-[#1A4744] backdrop-blur-xl py-2.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/images/Logo3.png"
                alt="Shades of Green Logo"
                className="h-12 sm:h-13 md:h-14 w-auto object-contain"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              {[
                "Home",
                "Gallery",
                "Lifestyle",
                "Amenities",
                "Connectivity",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                  className="group relative text-[16px] font-semibold text-white hover:text-emerald-700 transition-colors"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 xl:gap-4">
              {/* Contact Button & RERA Badge Stacked Vertically */}
              <div className="hidden lg:flex flex-col items-end gap-1">
                <a
                  href="tel:+919187210414"
                  className="inline-flex items-center gap-2 px-3.5 xl:px-4 py-1.5 bg-white text-black rounded-xl hover:bg-emerald-700 transition-colors font-semibold text-xs xl:text-sm shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +91 9187210414
                </a>

                {/* RERA Number directly below contact button */}
                <div className="text-[10px] font-mono font-semibold tracking-tight text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40 shadow-sm whitespace-nowrap">
                  RERA: PRM/KA/RERA/1251/446/PR/040826/008858
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 pt-4">
              <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-4">
                <nav className="flex flex-col gap-2">
                  {[
                    "Home",
                    "Gallery",
                    "Lifestyle",
                    "Amenities",
                    "Connectivity",
                    "Contact",
                  ].map((item) => (
                    <a
                      key={item}
                      href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                      className="text-sm font-semibold text-gray-800 hover:text-emerald-700 hover:bg-emerald-50 transition-colors rounded-xl px-4 py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </nav>

                {/* RERA Badge inside mobile menu drawer */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                  <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 block">
                    RERA: PRM/KA/RERA/1251/446/PR/040826/008858
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Request Price tab is mounted once, globally, in App.jsx
            (RequestPriceTab.jsx) so it's identical on every route including
            this one — no more homepage-only duplicate. */}

        {/* ✅ Updated Hero Section (Carousel with slide 2 form) */}
        <VillaHeroCarousel onContactClick={scrollToContact} />
        {/* Trustbar*/}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Building2 className="w-10 h-10 text-white" />,
                  title: "83 Exclusive 4BHK Villas",
                  desc: "A limited gated community planned for space, privacy, and premium living.",
                },
                {
                  icon: <Home className="w-10 h-10 text-white" />,
                  title: "Courtyard-Led Villa Planning",
                  desc: "Ground, first, and second floors designed to maximise light, openness, and comfort.",
                },
                {
                  icon: <Armchair className="w-10 h-10 text-white" />,
                  title: "15,000 SFT Clubhouse",
                  desc: "A signature clubhouse designed with modern architecture and landscape-facing views.",
                },
                {
                  icon: <MapPin className="w-10 h-10 text-white" />,
                  title: "Off Hennur, Near New Airport Road",
                  desc: "Easy access from Hennur-Bagulur Main Road and New Airport Road corridor.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-sm hover-lift"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#1A4744] flex items-center justify-center text-emerald-600 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About + Contact Cards */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* LEFT CONTENT */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-6 leading-tight">
                  At Shades of Green:
                  <span className="block text-gray-900">
                    Built for Space, Privacy, and Everyday Ease
                  </span>
                </h2>

                <p className="text-gray-600 leading-relaxed text-base mb-4">
                  HPR Infra is a Hyderabad-based developer bringing a premium
                  villa community to North Bengaluru. Shades of Green is planned
                  as a gated neighbourhood where design decisions support real
                  daily living, from spacious layouts to clearly defined work
                  and family zones, backed by integrity-led execution and strong
                  engineering fundamentals.
                </p>

                <p className="text-gray-600 leading-relaxed text-base">
                  The community is shaped as a calm, private sanctuary that
                  supports balance, comfort, and effortless everyday living.
                </p>
              </div>

              {/* RIGHT CONTACT GRID */}
              <div className="grid grid-cols-2 gap-6">
                {/* Call Us Card */}
                <div
                  onClick={() => setModalType("call")}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center min-h-[160px] cursor-pointer"
                >
                  <div className="text-[#1A4744]">
                    <Phone className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Call Us
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">
                    Request Number →
                  </span>
                </div>

                {/* Project Walkthrough Link */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center min-h-[160px] cursor-pointer"
                >
                  <div className="text-[#1A4744]">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Project Walkthrough
                  </span>
                </a>

                {/* Visit Us Link */}
                <a
                  href="https://maps.app.goo.gl/hR2z3mCcS1pZgVDH8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center min-h-[160px] cursor-pointer"
                >
                  <div className="text-[#1A4744]">
                    <MapPin className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Visit Us
                  </span>
                </a>

                {/* Download Brochure Card */}
                <div
                  onClick={() => setModalType("brochure")}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center min-h-[160px] cursor-pointer"
                >
                  <div className="text-[#1A4744]">
                    <Download className="w-10 h-10" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Download
                  </span>
                  <button
                    type="button"
                    className="mt-2 px-6 py-2.5 bg-[#1A4744] text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors text-xs"
                  >
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-[#1A4744] text-white text-xs font-semibold rounded-full mb-4">
                GALLERY
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visual stories of a villa community
                <span className="text-emerald-600 block">
                  designed around greens and open living
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((item, idx) => (
                <div
                  key={idx}
                  className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-md"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-end justify-end">
                    <span className="text-white font-semibold text-lg transform group-hover:scale-110 transition-transform duration-300 text-center px-4">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifestyle Section */}
        <section id="lifestyle" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Where Play is a{" "}
                <span className="text-emerald-600">Way of Life</span>
              </h2>
              <div className="w-24 h-1 bg-emerald-600 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <div className="space-y-6">
                  {/* Walkways */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A4744] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 18h18v2H3v-2zm4-4h2v4H7v-4zm4-6h2v10h-2V8zm4 3h2v7h-2v-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Nature-inspired walkways
                      </h3>
                      <p className="text-slate-600">
                        That make daily walks feel unhurried.
                      </p>
                    </div>
                  </div>

                  {/* Landscape & hardscape */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A4744] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 18h16l-6-8-4 5-2-3-4 6zm10-12a2 2 0 110 4 2 2 0 010-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Landscape and hardscape
                      </h3>
                      <p className="text-slate-600">
                        Designed to keep the community green and usable.
                      </p>
                    </div>
                  </div>

                  {/* Rain Water Harvesting */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A4744] flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M558-84q-15 8-30.5 2.5T504-102l-60-120q-8-15-2.5-30.5T462-276q15-8 30.5-2.5T516-258l60 120q8 15 2.5 30.5T558-84Zm240 0q-15 8-30.5 2.5T744-102l-60-120q-8-15-2.5-30.5T702-276q15-8 30.5-2.5T756-258l60 120q8 15 2.5 30.5T798-84Zm-480 0q-15 8-30.5 2.5T264-102l-60-120q-8-15-2.5-30.5T222-276q15-8 30.5-2.5T276-258l60 120q8 15 2.5 30.5T318-84Zm-18-236q-91 0-155.5-64.5T80-540q0-83 55-145t136-73q32-57 87.5-89.5T480-880q90 0 156.5 57.5T717-679q69 6 116 57t47 122q0 75-52.5 127.5T700-320H300Zm0-80h400q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-40q0-66-47-113t-113-47q-48 0-87.5 26T333-704l-10 24h-25q-57 2-97.5 42.5T160-540q0 58 41 99t99 41Zm180-200Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Rain Water Harvesting
                      </h3>
                      <p className="text-slate-600">
                        Every rain drop harvested. Every home replenished
                      </p>
                    </div>
                  </div>

                  {/* Brick Cladded Villas */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A4744] flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e8eaed"
                      >
                        <path d="M120-120v-520l520-200v360h40q0-33 23.5-56.5T760-560q33 0 56.5 23.5T840-480v360H120Zm80-80h160v-280h200v-244L200-585v385Zm240 0h120v-120h80v120h120v-200H440v200ZM280-560Zm320 360Zm0-20Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Brick Cladded Villas
                      </h3>
                      <p className="text-slate-600">
                        Brick-clad walls that breathe, insulate, and endure
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/Copy of V4.webp"
                    alt="Lifestyle at Shades of Green"
                    loading="lazy"
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-8 right-8 bg-white-500 text-white px-8 py-6 rounded-full shadow-lg">
                    {/* <div className="text-center">
                      <p className="font-bold text-lg">Family</p>
                      <p className="font-semibold">Friendly</p>
                      <p className="text-sm">Living</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Master Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Master plan view is indicative. Click on the image to view full
                screen and inspect details.
              </p>
              <button
                type="button"
                onClick={openRequestPriceModal}
                className="px-8 py-3 bg-[#1A4744] text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Request Latest Master Plan
              </button>
            </div>

            {/* Clickable Image Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white group cursor-pointer border border-gray-100">
              <div
                className="flex items-center justify-center bg-gray-50 relative"
                onClick={openMasterPlanModal}
              >
                <img
                  src="/images/MasterPlan.png"
                  alt="Master Plan Layout"
                  loading="lazy"
                  className="max-h-[420px] w-auto object-contain mx-auto py-6 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover Badge */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                FLOOR <span className="text-emerald-600">PLANS</span>
              </h2>
              <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6"></div>

              {/* Filters */}
              <div className="flex flex-wrap justify-center gap-6">
                {filters.map((item) => (
                  <div key={item} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleClick(item)}
                      className={`px-5 py-2 rounded-lg border transition-colors duration-200 cursor-pointer font-medium ${
                        active === item
                          ? "bg-emerald-600 text-white border-transparent shadow-md"
                          : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {item}
                    </button>

                    {/* Green line indicator */}
                    {active === item && (
                      <div className="w-6 h-[3px] bg-emerald-600 mt-2 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Grid with Pop-Out trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((item, index) => (
                <div
                  key={item.image || index}
                  onClick={() => openPlanModal(item.image)}
                  className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={`${item.category} Plan`}
                    loading="lazy"
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                At Shades of Green: Design Meets Liveability
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                "Grand Entrance",
                "Clubhouse",
                "Pet Park",
                "Reflexology Park",
                "Children's Park",
                "Swimming Pool",
                "Outdoor Gym",
                "Indoor Games",
                "Pickleball Court",
                "Cricket Pitch",
                "Nature-inspired Walkways",
                "Landscape and Hardscape",
                "Gym",
                "Banquet Hall",
                "Co-working Space",
                "Guest Rooms in ClubHouse",
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="
        group bg-white px-4 py-4 rounded-xl
        border border-gray-100
        shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-lg
        hover:border-emerald-200
        cursor-default
        text-center
      "
                >
                  <span
                    className="
        text-sm font-medium text-gray-800
        transition-colors duration-300
        group-hover:text-emerald-700
      "
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Bar */}
        {/* 
        <section className="bg-[#1A4744] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {[
                { value: "83", label: "Villas" },
                { value: "4BHK", label: "Layouts" },
                { value: "15,000", label: "SFT Clubhouse" },
                { value: "4.25", label: "Acres Land" },
                { value: "250 m", label: "From Main Road" },
                { value: "16 km", label: "Airport" },
                { value: "6 km", label: "Metro Station" },
                // { value: "23 km", label: "Majestic" },
                // { value: "23 km", label: "Railway Station" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="
            group text-center
            rounded-xl
            px-2 py-4
            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:bg-white/10
            hover:shadow-lg
          "
                >
                  <div
                    className="
            text-3xl md:text-4xl font-bold mb-2
            transition-transform duration-300
            group-hover:scale-105
          "
                  >
                    {stat.value}
                  </div>
                  <div
                    className="
            text-sm text-emerald-100
            transition-colors duration-300
            group-hover:text-white
          "
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <section className="bg-[#1A4744] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Grid forces 7 equal columns on desktop (lg+), ensuring everything sits on one line */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6 justify-center items-center">
              {[
                { value: "83", label: "Villas" },
                { value: "4BHK", label: "Layouts" },
                { value: "15,000", label: "SFT Clubhouse" },
                { value: "4.25", label: "Acres Land" },
                { value: "250 m", label: "From Main Road" },
                { value: "16 km", label: "Airport" },
                { value: "6 km", label: "Metro Station" },
                // { value: "23 km", label: "Majestic" },
                // { value: "23 km", label: "Railway Station" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="
            group text-center
            rounded-xl
            w-full
            px-2 py-4
            transition-all duration-300 ease-out
            hover:-translate-y-1
            hover:bg-white/10
            hover:shadow-lg
          "
                >
                  <div
                    className="
              text-2xl lg:text-3xl xl:text-4xl font-bold mb-2
              transition-transform duration-300
              group-hover:scale-105
              whitespace-nowrap
            "
                  >
                    {stat.value}
                  </div>
                  <div
                    className="
              text-xs lg:text-sm text-emerald-100
              transition-colors duration-300
              group-hover:text-white
            "
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* We Think Green */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Sustainable by Nature, Practical by Design
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Shades of Green is planned to feel green in everyday life, not
                  just on renderings. From material choices to landscape-led
                  community planning, the intent is to build spaces that stay
                  comfortable, durable, and relevant for years.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      icon: <Building2 className="w-6 h-6" />,
                      label: "Brick-cladded villa",
                    },
                    // {
                    //   icon: <Shield className="w-6 h-6" />,
                    //   label: "Low U-value glass for better performance",
                    // },
                    {
                      icon: <Leaf className="w-6 h-6" />,
                      label: "Landscape-forward planning",
                    },
                    {
                      icon: <Trees className="w-6 h-6" />,
                      label: "Walkable community design",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-[#1A4744] rounded-lg"
                    >
                      <div className="text-emerald-600">{item.icon}</div>
                      <span className="text-white font-medium">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="px-8 py-3 bg-[#1A4744] text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Contact Us
                </button>
              </div>

              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/Lifestyle image.jpg"
                  alt="Green Spaces"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Amenities */}

        <section
          id="amenities"
          className="bg-gradient-to-b from-white to-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-emerald-600 text-sm font-semibold tracking-wider uppercase mb-2">
                AMENITIES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Amenities That Make Everyday Villa Living Better
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Click on any category below to view the complete list of
                facilities.
              </p>
            </div>

            {/* Mobile Marquee */}
            <div className="md:hidden overflow-hidden">
              <div className="flex w-max gap-4 animate-marquee-mobile">
                {[...amenitiesCategoryData, ...amenitiesCategoryData].map(
                  (item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedAmenity(item)}
                        className="w-[280px] flex-shrink-0 bg-white p-8 text-center rounded-2xl shadow-sm cursor-pointer border border-gray-100 hover:border-emerald-500 transition-all"
                      >
                        <div className="mb-6">
                          <Icon className="w-16 h-16 mx-auto text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {item.shortDesc}
                        </p>
                        <span className="mt-4 inline-block text-xs font-semibold text-emerald-700 underline">
                          View Facilities →
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Desktop Interactive Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {amenitiesCategoryData.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAmenity(item)}
                    className="bg-white p-8 text-center rounded-2xl border border-gray-100 shadow-sm group hover:bg-[#1A4744] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-6">
                        <Icon className="w-16 h-16 mx-auto text-emerald-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-white/90 leading-relaxed text-sm transition-colors duration-300">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <style jsx>{`
            @keyframes marqueeMobile {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee-mobile {
              animation: marqueeMobile 12s linear infinite;
            }
          `}</style>
        </section>

        {/* Connectivity */}
        <section
          id="connectivity"
          className="relative py-20 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <p className="text-white/90 text-sm font-semibold tracking-wider uppercase mb-2">
                Location
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Conveniently Connected
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Strategically positioned in a prime area with seamless
                connectivity to essential amenities
              </p>
            </div>

            {/* Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Map */}
              <div className="relative">
                <div className="bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="aspect-square rounded-xl relative overflow-hidden">
                    {/* <img
                      src="/images/Map.webp"
                      alt="Project Location Map"
                      className="absolute inset-0 w-full h-full object-cover"
                    /> */}
                    <video
                      src="/images/Location.mp4"
                      // your thumbnail image
                      controls // shows play/pause, volume, etc.
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    ></video>
                    <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Connectivity List (1×4) */}
              <div className="space-y-4">
                {/* Schools & Colleges */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1A4744] rounded-xl p-3 flex-shrink-0">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Schools & Colleges
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Oasis International School, BM International School, CMR
                        University, REVA University
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hospitals */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1A4744] rounded-xl p-3 flex-shrink-0">
                      <HeartPulse className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Hospitals
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Regal Hospital, Sparsh Hospital, Aster CMI Hospital,
                        Manipal Hospital
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leisure & Shopping */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1A4744] rounded-xl p-3 flex-shrink-0">
                      <ShoppingBag className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Leisure & Shopping
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Bharatiya city mall, Elements Mall, Phoenix Mall of Asia
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Parks & Offices */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1A4744] rounded-xl p-3 flex-shrink-0">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        Tech Parks & Offices
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Bharathiya City Tech Park, Embassy Manyata, Karle Town
                        Centre, KIADB Aerospace SEZ, Amazon Tech Park
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Big Banner */}
        <section className="relative py-20 text-white overflow-hidden">
          {/* Background image */}
          <img
            src="/images/Rainharvesting image.jpeg"
            alt="Rainwater harvesting system at Shades of Green"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content */}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-snug">
              Where Every Raindrop Has a Purpose
            </h2>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Our villas integrate self-cleaning Rainy Dual Intensity filters
              that harvest rooftop rainwater using cohesion and centrifugal
              force ensuring that every drop of rain is captured, filtered, and
              returned to the earth — replenishing the water table for the
              entire community over time
            </p>

            {/* <button
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#1A4744] text-white rounded-lg hover:bg-emerald-500 transition-all duration-300 font-bold text-lg shadow-xl"
            >
              Get Floor Plans
            </button> */}
          </div>
        </section>

        {/* Clubhouse Feature */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/Clubhouse approach street view.png"
                  alt="Clubhouse Feature"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  A Signature Clubhouse Designed to Feel Like a Destination
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  The luxorious 15000 Sq. ft. clubhouse is planned as the heart
                  of the community, with modern architecture and multiple
                  landscape-facing views. It is complemented by pool-led social
                  spaces, designed to make evenings and weekends feel naturally
                  active and social.
                </p>
                <button
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="px-8 py-3 bg-[#1A4744] text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-stretch">
              {/* Left: Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-full min-h-[520px]">
                <img
                  src="/images/Form.jpeg"
                  alt="Shades of Green Villas"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600 max-w-md">
                    Fill out the form below and our team will get back to you
                    shortly.
                  </p>
                </div>

                {submitError && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {submitError}
                  </div>
                )}

                {/* <form
                  onSubmit={handleSubmit}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />

                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600 transition-all"
                  >
                    <option value="">I'm interested in...</option>
                    <option value="Villa Details">Villa Details</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Pricing Information">
                      Pricing Information
                    </option>
                    <option value="Floor Plans">Floor Plans</option>
                  </select>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows="4"
                    className="md:col-span-2 px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all"
                  ></textarea>

                  <button
                    type="submit"
                    className="md:col-span-2 w-full bg-[#1A4744] text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
                  >
                    Submit Inquiry
                  </button>
                </form> */}
                <form
                  onSubmit={handleSubmit}
                  className="grid md:grid-cols-2 gap-6"
                  noValidate
                >
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name *"
                      className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.name
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.email
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-Digit Mobile Number *"
                      className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        formErrors.phone
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Interest Dropdown */}
                  <div>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 text-gray-600 transition-all ${
                        formErrors.interest
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                    >
                      <option value="">I'm interested in... *</option>
                      <option value="Villa Details">Villa Details</option>
                      <option value="Site Visit">Site Visit</option>
                      <option value="Pricing Information">
                        Pricing Information
                      </option>
                      <option value="Floor Plans">Floor Plans</option>
                    </select>
                    {formErrors.interest && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {formErrors.interest}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows="4"
                    className="md:col-span-2 px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all"
                  ></textarea>

                  <button
                    type="submit"
                    className="md:col-span-2 w-full bg-[#1A4744] text-white px-6 py-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-lg"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* POP-OUT MASTER PLAN MODAL WITH ZOOM */}
      {/* PERFECTLY BOUNDED MASTER PLAN MODAL */}
      {isMasterPlanOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 select-none">
          {/* Control Toolbar */}
          <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-black/75 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="h-6 w-[1px] bg-white/20 mx-1" />

            <button
              type="button"
              onClick={closeMasterPlanModal}
              className="p-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Locked Viewport Container */}
          <div
            ref={masterPlanContainerRef}
            onMouseDown={handleMasterPlanMouseDown}
            onMouseMove={handleMasterPlanMouseMove}
            onMouseUp={handleMasterPlanMouseUp}
            onMouseLeave={handleMasterPlanMouseUp}
            className="w-full h-full max-w-7xl max-h-[90vh] overflow-hidden flex items-center justify-center relative rounded-xl"
            style={{
              cursor:
                scale > 1
                  ? isDraggingMasterPlan
                    ? "grabbing"
                    : "grab"
                  : "default",
            }}
          >
            <img
              src="/images/MasterPlan.png"
              alt="Master Plan Detailed View"
              draggable={false}
              className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${masterPlanPos.x}px, ${masterPlanPos.y}px, 0px) scale(${scale})`,
              }}
            />
          </div>
        </div>
      )}

      {/* POP-OUT FLOOR PLAN MODAL WITH ZOOM */}
      {/* POP-OUT FLOOR PLAN MODAL WITH BOUNDED ZOOM & PAN */}
      {selectedPlanImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 select-none">
          {/* Floating Controls Toolbar */}
          <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-black/75 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={handlePlanZoomIn}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handlePlanZoomOut}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handlePlanResetZoom}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="h-6 w-[1px] bg-white/20 mx-1" />

            <button
              type="button"
              onClick={closePlanModal}
              className="p-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Locked Viewport Container */}
          <div
            ref={planContainerRef}
            onMouseDown={handlePlanMouseDown}
            onMouseMove={handlePlanMouseMove}
            onMouseUp={handlePlanMouseUp}
            onMouseLeave={handlePlanMouseUp}
            className="w-full h-full max-w-7xl max-h-[90vh] overflow-hidden flex items-center justify-center relative rounded-xl"
            style={{
              cursor:
                planScale > 1
                  ? isDraggingPlan
                    ? "grabbing"
                    : "grab"
                  : "default",
            }}
          >
            <img
              src={selectedPlanImage}
              alt="Enlarged Floor Plan"
              draggable={false}
              className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${planPos.x}px, ${planPos.y}px, 0px) scale(${planScale})`,
              }}
            />
          </div>
        </div>
      )}

      {/* AMENITY DETAILS POPUP MODAL */}
      {selectedAmenity && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full border border-gray-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedAmenity(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-[#1A4744] flex items-center justify-center text-white flex-shrink-0">
                {React.createElement(selectedAmenity.icon, {
                  className: "w-8 h-8",
                })}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedAmenity.title}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                  Key Features & Facilities
                </p>
              </div>
            </div>

            {/* Facilities List */}
            <ul className="space-y-3 mb-8">
              {selectedAmenity.detailedItems.map((facility, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-gray-700 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="font-medium leading-snug">{facility}</span>
                </li>
              ))}
            </ul>

            {/* Close Action Button */}
            <button
              type="button"
              onClick={() => setSelectedAmenity(null)}
              className="w-full bg-[#1A4744] hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* LEAD CAPTURE MODAL */}
      {/* COMBINED EMAIL & MOBILE LEAD CAPTURE MODAL */}
     {/* LEAD CAPTURE MODAL (Call / Brochure) */}
{modalType && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden">
      {/* Themed header band */}
      <div className="bg-[#1A4744] px-6 py-5 md:px-8 relative">
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img src="/images/Logo3.png" alt="" className="h-9 w-auto object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Shades of Green</p>
            <p className="text-emerald-200 text-[11px]">by HPR Infra</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
      {showDownloadSuccess ? (
        /* Brochure Download Success View */
        <div className="text-center py-2">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
              <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1A4744] mb-2">Your Brochure is Downloading</h3>
          <p className="text-sm text-gray-500 mb-6">
            If the download didn't start automatically, tap the button below.
          </p>
          <button
            type="button"
            onClick={redownloadBrochure}
            className="w-full bg-[#1A4744] hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-md mb-3"
          >
            Download Again
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full text-gray-500 hover:text-gray-700 font-semibold py-2 text-sm transition-colors"
          >
            Close
          </button>
        </div>
      ) : !showPhoneResult ? (
        <>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {modalType === "brochure"
                ? "Download Brochure"
                : "Request a Call"}
            </h3>
            <p className="text-sm text-gray-600">
              Please enter your details to{" "}
              {modalType === "brochure"
                ? "download the official brochure."
                : "view our contact details."}
            </p>
          </div>

          {leadModalFormError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {leadModalFormError}
            </div>
          )}

          <form onSubmit={handleLeadSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (leadModalErrors.email) {
                    setLeadModalErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="Email Address *"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${
                  leadModalErrors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {leadModalErrors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {leadModalErrors.email}
                </p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div>
              <input
                type="tel"
                maxLength="10"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (leadModalErrors.phone) {
                    setLeadModalErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                placeholder="10-Digit Mobile Number *"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${
                  leadModalErrors.phone
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {leadModalErrors.phone && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {leadModalErrors.phone}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A4744] hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-md disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : modalType === "brochure"
                ? "Download Brochure"
                : "Reveal Number"}
            </button>
          </form>
        </>
      ) : (
        /* Phone Number Result View */
        <div className="text-center py-2">
          <div className="w-16 h-16 bg-emerald-100 text-[#1A4744] rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Contact Our Sales Team
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            You can reach us directly at:
          </p>

          <a
            href="tel:+919187210414"
            className="inline-block text-2xl font-bold text-emerald-700 bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200 mb-6 hover:bg-emerald-100 transition-colors"
          >
            +91 9187210414
          </a>

          <button
            type="button"
            onClick={closeModal}
            className="w-full bg-[#1A4744] text-white font-semibold py-3 rounded-lg text-sm"
          >
            Done
          </button>
        </div>
      )}
      </div>
    </div>
  </div>
)}
      {/* Footer */}
      <footer className="bg-[#1A4744] pt-16 pb-10 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
            {/* Logo + Description */}
            <div className="space-y-4">
              <img
                src="/images/HPR_LOGO.png"
                alt="HPR Infra Logo"
                className="h-28 w-auto object-contain"
              />
              <p className="text-sm text-white leading-relaxed max-w-xs">
                HPR Infra - Your Trusted Partner for Apartments, Villas &
                Plotted Developments.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Home",
                  "Gallery",
                  "Lifestyle",
                  "Amenities",
                  "Connectivity",
                  "Contact",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "")}`}
                      className="text-white hover:text-emerald-600 transition-colors font-medium"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-white hover:text-emerald-600 transition-colors font-medium"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="text-white hover:text-emerald-600 transition-colors font-medium"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact Us */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>

              <div className="space-y-4 text-sm text-white">
                {/* Address */}
                <p>Head Office Address</p>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="leading-relaxed">
                    101, Silicon towers Near image gardens, Image garden road
                    Madhapur – 500081
                  </p>
                </div>

                <p>Marketing Office Address</p>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="leading-relaxed">
                    Sy.No.:59/1, 59/2 & 59/3. Kadusoppanahalli
                    Village,Bidarahalli Hobli, Bengaluru East Taluk, Bengaluru
                    District.
                  </p>
                </div>
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:+919187210414"
                    className="hover:text-blue-600 transition-colors"
                  >
                    +91 9187210414
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:sales@hprinfra.com"
                    className="hover:text-blue-600 transition-colors break-all"
                  >
                    sales@hprinfra.com
                  </a>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Follow Us</h4>

              <div className="flex gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/people/HPR-Infra/61586207792555/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/hpr_infra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 hover:bg-red-400 text-red-600 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>

                {/* Twitter */}
                {/* <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 hover:bg-sky-500 text-sky-600 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a> */}

                {/* LinkedIn */}
                {/* <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 hover:bg-blue-700 text-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a> */}

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@HPRInfra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer (like screenshot) */}
          <div className="border-t border-gray-200 pt-6 pb-6">
            <p className="text-xs text-white leading-relaxed">
              <strong>Disclaimer:</strong> All images are artistic impressions
              unless stated. Areas, specifications, and approvals are subject to
              authority revisions.
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white">
              © 2025 Shades of Green by HPR Infra. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShadesOfGreenLanding;
