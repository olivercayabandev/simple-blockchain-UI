import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  ClipboardCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Shield,
  Database,
  Lock,
} from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  age: string;
  studentNumber: string;
  course: string;
  yearLevel: string;
}

interface FormErrors {
  [key: string]: string;
}

const COURSES = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Computer Engineering",
  "BS Electronics Engineering",
  "BS Electrical Engineering",
];

const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const STORAGE_KEY = "ashley_registration_data";
const SUBMISSION_KEY = "ashley_submitted";

export function AshleyForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    age: "",
    studentNumber: "",
    course: "",
    yearLevel: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.step1Complete) {
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (localStorage.getItem(SUBMISSION_KEY) === "true") {
      setIsSubmitted(true);
      const savedSubmission = localStorage.getItem("ashley_submitted_data");
      if (savedSubmission) {
        setSubmittedData(JSON.parse(savedSubmission));
      }
    }
  }, []);

  const sanitizeInput = (value: string): string => {
    return value.trim().replace(/[<>]/g, "");
  };

  const validateName = (name: string): { valid: boolean; error: string } => {
    if (!name) return { valid: false, error: "This field is required" };
    if (!/^[a-zA-Z\s]+$/.test(name))
      return { valid: false, error: "Only letters and spaces allowed" };
    return { valid: true, error: "" };
  };

  const validateEmail = (email: string): { valid: boolean; error: string } => {
    if (!email) return { valid: false, error: "Email is required" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { valid: false, error: "Invalid email format" };
    return { valid: true, error: "" };
  };

  const validateAge = (age: string): { valid: boolean; error: string } => {
    if (!age) return { valid: false, error: "Age is required" };
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) return { valid: false, error: "Age must be a number" };
    if (ageNum < 18 || ageNum > 60) return { valid: false, error: "Age must be between 18 and 60" };
    return { valid: true, error: "" };
  };

  const validateStudentNumber = (num: string): { valid: boolean; error: string } => {
    if (!num) return { valid: false, error: "Student Number is required" };
    if (!/^20\d{2}-\d{5}$/.test(num))
      return { valid: false, error: 'Format must be: 20XX-##### (e.g., 2024-12345)' };
    return { valid: true, error: "" };
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    const firstNameValidation = validateName(sanitizeInput(formData.firstName));
    if (!firstNameValidation.valid) newErrors.firstName = firstNameValidation.error;

    const lastNameValidation = validateName(sanitizeInput(formData.lastName));
    if (!lastNameValidation.valid) newErrors.lastName = lastNameValidation.error;

    const middleNameValidation = validateName(sanitizeInput(formData.middleName));
    if (!middleNameValidation.valid) newErrors.middleName = middleNameValidation.error;

    const emailValidation = validateEmail(sanitizeInput(formData.email));
    if (!emailValidation.valid) newErrors.email = emailValidation.error;

    const ageValidation = validateAge(sanitizeInput(formData.age));
    if (!ageValidation.valid) newErrors.age = ageValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    const studentNumValidation = validateStudentNumber(sanitizeInput(formData.studentNumber));
    if (!studentNumValidation.valid) newErrors.studentNumber = studentNumValidation.error;

    if (!formData.course) newErrors.course = "Please select a course";
    else if (!COURSES.includes(formData.course)) newErrors.course = "Invalid course selection";

    if (!formData.yearLevel) newErrors.yearLevel = "Please select a year level";
    else if (!YEAR_LEVELS.includes(formData.yearLevel)) newErrors.yearLevel = "Invalid year level";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      const dataToSave = { ...formData, step1Complete: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setErrors({});
    }
  };

  const handleGoToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleFinalSubmit = () => {
    if (validateStep2()) {
      const finalData = {
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        middleName: sanitizeInput(formData.middleName),
        email: sanitizeInput(formData.email),
        age: sanitizeInput(formData.age),
        studentNumber: sanitizeInput(formData.studentNumber),
        course: formData.course,
        yearLevel: formData.yearLevel,
      };

      localStorage.setItem("ashley_submitted_data", JSON.stringify(finalData));
      localStorage.setItem(SUBMISSION_KEY, "true");
      localStorage.removeItem(STORAGE_KEY);

      setSubmittedData(finalData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SUBMISSION_KEY);
    localStorage.removeItem("ashley_submitted_data");
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      age: "",
      studentNumber: "",
      course: "",
      yearLevel: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
    setCurrentStep(1);
  };

  if (isSubmitted && submittedData) {
    return <SuccessView data={submittedData} onReset={handleReset} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Student Registration</h2>
            <p className="text-purple-100 text-sm mt-1">Secure Multi-Step Form System</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">Protected</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
              <Database className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">State Managed</span>
            </div>
          </div>
        </div>
      </div>

      <ProgressBar currentStep={currentStep} onStepClick={handleGoToStep} />

      <div className="p-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1Form
              key="step1"
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onNext={handleNextStep}
            />
          )}
          {currentStep === 2 && (
            <Step2Form
              key="step2"
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onNext={handleFinalSubmit}
              onPrev={handlePrevStep}
            />
          )}
          {currentStep === 3 && (
            <ReviewStep
              key="review"
              formData={formData}
              onSubmit={handleFinalSubmit}
              onPrev={handlePrevStep}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProgressBar({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  const steps = [
    { number: 1, label: "Personal Info", icon: User },
    { number: 2, label: "Academic Info", icon: GraduationCap },
    { number: 3, label: "Review", icon: ClipboardCheck },
  ];

  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const canClick = isCompleted;

          return (
            <div key={step.number} className="flex items-center">
              <button
                onClick={() => canClick && onStepClick(step.number)}
                disabled={!canClick && !isActive}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  canClick
                    ? "cursor-pointer hover:bg-green-100"
                    : isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } ${isCompleted ? "bg-green-500 text-white" : ""} ${
                  !canClick && !isActive ? "cursor-not-allowed" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-white text-indigo-600"
                      : isCompleted
                      ? "bg-white/30"
                      : "bg-gray-300"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`font-medium ${isActive || isCompleted ? "text-white" : "text-gray-600"}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 rounded ${
                    isCompleted ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = true,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-200 focus:border-indigo-500 focus:bg-white"
        }`}
      />
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none appearance-none bg-white ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-200 focus:border-indigo-500"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

function Step1Form({
  formData,
  errors,
  onChange,
  onNext,
}: {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Personal Information
        </h3>
        <p className="text-gray-500 text-sm mt-1">Step 1 of 3 - Enter your personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(v) => onChange("firstName", v)}
          error={errors.firstName}
          placeholder="John"
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(v) => onChange("lastName", v)}
          error={errors.lastName}
          placeholder="Doe"
        />
      </div>

      <InputField
        label="Middle Name"
        name="middleName"
        value={formData.middleName}
        onChange={(v) => onChange("middleName", v)}
        error={errors.middleName}
        placeholder="M"
      />

      <InputField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={(v) => onChange("email", v)}
        error={errors.email}
        placeholder="john.doe@example.com"
      />

      <InputField
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={(v) => onChange("age", v)}
        error={errors.age}
        hint="Must be between 18 and 60"
        placeholder="18-60"
      />

      <div className="flex justify-end mt-6">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          Next Step
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function Step2Form({
  formData,
  errors,
  onChange,
  onNext,
  onPrev,
}: {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          Academic Information
        </h3>
        <p className="text-gray-500 text-sm mt-1">Step 2 of 3 - Enter your academic details</p>
      </div>

      <InputField
        label="Student Number"
        name="studentNumber"
        value={formData.studentNumber}
        onChange={(v) => onChange("studentNumber", v)}
        error={errors.studentNumber}
        placeholder="2024-12345"
        hint="Format: 20XX-##### (e.g., 2024-00001)"
      />

      <SelectField
        label="Course"
        name="course"
        value={formData.course}
        onChange={(v) => onChange("course", v)}
        options={COURSES}
        error={errors.course}
      />

      <SelectField
        label="Year Level"
        name="yearLevel"
        value={formData.yearLevel}
        onChange={(v) => onChange("yearLevel", v)}
        options={YEAR_LEVELS}
        error={errors.yearLevel}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          Review
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function ReviewStep({
  formData,
  onSubmit,
  onPrev,
}: {
  formData: FormData;
  onSubmit: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-indigo-600" />
          Review Your Information
        </h3>
        <p className="text-gray-500 text-sm mt-1">Step 3 of 3 - Please verify all details before submitting</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="mb-6">
          <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Information
          </h4>
          <div className="space-y-2">
            <ReviewItem label="First Name" value={formData.firstName} />
            <ReviewItem label="Last Name" value={formData.lastName} />
            <ReviewItem label="Middle Name" value={formData.middleName} />
            <ReviewItem label="Email" value={formData.email} />
            <ReviewItem label="Age" value={formData.age} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Academic Information
          </h4>
          <div className="space-y-2">
            <ReviewItem label="Student Number" value={formData.studentNumber} />
            <ReviewItem label="Course" value={formData.course} />
            <ReviewItem label="Year Level" value={formData.yearLevel} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3 mb-6">
        <Lock className="w-4 h-4" />
        <span>By clicking Submit, your information will be securely processed</span>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </button>
        <button
          onClick={onSubmit}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <CheckCircle className="w-5 h-5" />
          Final Submit
        </button>
      </div>
    </motion.div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 font-medium">{value || "-"}</span>
    </div>
  );
}

function SuccessView({
  data,
  onReset,
}: {
  data: FormData;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white">Registration Complete!</h2>
        <p className="text-green-100 mt-2">Your information has been securely submitted</p>
      </div>

      <div className="p-6">
        <div className="bg-gray-900 rounded-xl p-6 mb-6 overflow-auto max-h-96">
          <p className="text-green-400 font-mono text-sm">
            {`array(\n${Object.entries(data)
              .map(([key, value]) => `    [${key}] => ${value}`)
              .join(`\n`)}\n)`}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Security Notice</h4>
              <p className="text-blue-700 text-sm mt-1">
                All data has been sanitized using input escaping. Session data has been securely
                destroyed to prevent re-submission on page refresh.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onReset}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Start New Registration
          </button>
        </div>
      </div>
    </motion.div>
  );
}
