import React, { useState, useEffect } from "react";
import { Calendar, FileText, Camera, Leaf, Bell, User, LogOut, Award, Phone, HelpCircle, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Clock, Loader } from "lucide-react";

// Mock database
const mockDatabase = {
  currentRental: {
    productName: "EcoWasher Pro 3000",
    startDate: "May 1, 2023",
    endDate: "June 1, 2023",
    dailyRate: 12.99,
    modelNumber: "EWP-3K-2023",
    serialNumber: "SN-ECOW-789456",
    manufacturer: "EcoHome Appliances",
  },
  userProfile: {
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    notifications: {
      email: true,
      sms: true,
      promotions: false,
      ecoTips: true,
    },
  },
  conditionReports: [
    {
      id: "report1",
      type: "cosmetic",
      title: "Minor Scratch Reported",
      date: "May 5, 2023",
      status: "Under Review",
      description: "Noticed a small scratch on the front panel during cleaning.",
      photos: [],
    },
    {
      id: "report2",
      type: "support",
      title: "Setup Assistance",
      date: "May 1, 2023",
      status: "Resolved",
      description: "Needed help with initial setup and calibration.",
      photos: [],
    },
  ],
  notifications: [
    {
      id: 1,
      title: "Rental Extension Approved",
      message: "Your rental extension request has been approved until June 15.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Eco Tip of the Day",
      message: "Using cold water saves 80% of the energy used for laundry.",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      title: "Upcoming Return Reminder",
      message: "Your rental period ends in 3 days. Consider extending if needed.",
      time: "2 days ago",
      read: true,
    },
  ],
};

interface EndUserPortalProps {
  onLogout: () => void;
}

const EndUserPortal: React.FC<EndUserPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGuidelines, setExpandedGuidelines] = useState<string[]>([]);
  const [reportDescription, setReportDescription] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRental, setCurrentRental] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [conditionReports, setConditionReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: true,
    promotions: false,
    ecoTips: true,
  });

  // Simulate API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // "Fetch" data from mock database
      setCurrentRental(mockDatabase.currentRental);
      setUserProfile(mockDatabase.userProfile);
      setConditionReports(mockDatabase.conditionReports);
      setNotifications(mockDatabase.notifications);
      setFormData({
        firstName: mockDatabase.userProfile.firstName,
        lastName: mockDatabase.userProfile.lastName,
        email: mockDatabase.userProfile.email,
        phone: mockDatabase.userProfile.phone,
      });
      setNotificationPrefs(mockDatabase.userProfile.notifications);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const toggleGuideline = (id: string) => {
    if (expandedGuidelines.includes(id)) {
      setExpandedGuidelines(expandedGuidelines.filter((item) => item !== id));
    } else {
      setExpandedGuidelines([...expandedGuidelines, id]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const files = Array.from(e.target.files);
      
      // Simulate upload delay
      setTimeout(() => {
        const newPhotos = files.map((file) => URL.createObjectURL(file));
        setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedIssue || !reportDescription) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReport = {
      id: `report${conditionReports.length + 1}`,
      type: selectedIssue,
      title: commonIssues.find(issue => issue.id === selectedIssue)?.label + " Reported",
      date: new Date().toLocaleDateString(),
      status: "Pending",
      description: reportDescription,
      photos: uploadedPhotos,
    };
    
    setConditionReports([newReport, ...conditionReports]);
    setSelectedIssue("");
    setReportDescription("");
    setUploadedPhotos([]);
    
    // Simulate notification
    const newNotification = {
      id: notifications.length + 1,
      title: "Report Submitted",
      message: `Your ${newReport.title} has been received.`,
      time: "Just now",
      read: false,
    };
    
    setNotifications([newNotification, ...notifications]);
    setIsLoading(false);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update mock database
    mockDatabase.userProfile = {
      ...mockDatabase.userProfile,
      ...formData,
      notifications: notificationPrefs,
    };
    
    // Show success notification
    const newNotification = {
      id: notifications.length + 1,
      title: "Profile Updated",
      message: "Your profile changes have been saved.",
      time: "Just now",
      read: false,
    };
    
    setNotifications([newNotification, ...notifications]);
    setIsLoading(false);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const requestExtension = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update mock database
    mockDatabase.currentRental.endDate = "June 15, 2023";
    setCurrentRental({ ...mockDatabase.currentRental });
    
    // Add notification
    const newNotification = {
      id: notifications.length + 1,
      title: "Extension Requested",
      message: "Your rental extension request has been submitted for approval.",
      time: "Just now",
      read: false,
    };
    
    setNotifications([newNotification, ...notifications]);
    setIsLoading(false);
  };

  const usageGuidelines = [
    {
      id: "setup",
      title: "Product Setup",
      content: "Place the product on a stable, flat surface away from direct sunlight and moisture sources.",
    },
    {
      id: "operation",
      title: "Daily Operation",
      content: "Use the eco-mode whenever possible to reduce energy consumption by 30%. Avoid running at maximum capacity for extended periods.",
    },
    {
      id: "cleaning",
      title: "Cleaning & Maintenance",
      content: "Clean with a damp cloth only. Do not use abrasive cleaners. Perform weekly filter checks if applicable.",
    },
    {
      id: "safety",
      title: "Safety Precautions",
      content: "Keep away from children and pets. Unplug when not in use for extended periods. Do not cover ventilation openings.",
    },
  ];

  const commonIssues = [
    { id: "damage", label: "Physical Damage" },
    { id: "malfunction", label: "Functional Issue" },
    { id: "missing", label: "Missing Part" },
    { id: "cosmetic", label: "Cosmetic Imperfection" },
    { id: "other", label: "Other Issue" },
  ];

  const timelineSteps = [
    {
      id: "delivery",
      title: "Delivery Completed",
      date: "May 1, 2023",
      completed: true,
      description: "Product was delivered and set up by our technician.",
    },
    {
      id: "midterm",
      title: "Mid-term Check",
      date: "May 15, 2023",
      completed: true,
      description: "Scheduled maintenance performed. All systems functioning normally.",
    },
    {
      id: "current",
      title: "Current Usage",
      date: "Now",
      completed: true,
      description: `You've saved approximately 2.3kg CO₂ compared to traditional models.`,
    },
    {
      id: "return",
      title: "Scheduled Return",
      date: currentRental?.endDate || "June 1, 2023",
      completed: false,
      description: "Prepare product for return packaging. Our team will contact you.",
    },
  ];

  const ecoTips = [
    {
      category: "Energy Saving",
      tips: [
        "Use during off-peak hours (8pm-6am) for lowest carbon impact",
        "Enable auto-shutdown when not in use",
        "Keep at moderate settings (20-22°C for climate devices)",
      ],
    },
    {
      category: "Efficient Use",
      tips: [
        "Full loads are more efficient than partial ones",
        "Regular cleaning improves efficiency by up to 15%",
        "Use recommended accessories for optimal performance",
      ],
    },
    {
      category: "Environmental Impact",
      tips: [
        "Your rental has saved 7kg of manufacturing waste",
        "Shared use reduces neighborhood carbon footprint by ~12%",
        "Return packaging is 100% recyclable",
      ],
    },
  ];

  const getPageTitle = () => {
    const item = sidebarItems.find((item) => item.id === activeTab);
    return item ? item.label : "Schedule & Timeline";
  };

  const renderContent = () => {
    if (isLoading || !currentRental || !userProfile) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-green-600" />
        </div>
      );
    }

    switch (activeTab) {
      case "schedule":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Rental</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-500">Product</h3>
                  <p className="text-lg mt-1">{currentRental.productName}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-500">Rental Period</h3>
                  <p className="text-lg mt-1">
                    {currentRental.startDate} - {currentRental.endDate}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-500">Daily Rate</h3>
                  <p className="text-lg mt-1">${currentRental.dailyRate}/day</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Rental Timeline</h2>
              <div className="space-y-4">
                {timelineSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            step.completed ? "bg-green-100" : "bg-gray-100"
                          }`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-gray-500 text-sm">{step.date}</p>
                      <p className="text-gray-700 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={requestExtension}
                  disabled={isLoading}
                  className={`border border-green-500 text-green-600 hover:bg-green-50 rounded-lg p-4 text-center transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Processing..." : "Request Extension"}
                </button>
                <button className="border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg p-4 text-center transition-colors">
                  Download Rental Agreement
                </button>
              </div>
            </div>
          </div>
        );

      case "usage":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Product Usage Guidelines</h2>
              <div className="space-y-4">
                {usageGuidelines.map((guideline) => (
                  <div key={guideline.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleGuideline(guideline.id)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-left">{guideline.title}</h3>
                      {expandedGuidelines.includes(guideline.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    {expandedGuidelines.includes(guideline.id) && (
                      <div className="p-4 pt-0 border-t">
                        <p className="text-gray-700">{guideline.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Reference</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Model Number</h3>
                  <p className="text-gray-900">{currentRental.modelNumber}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Serial Number</h3>
                  <p className="text-gray-900">{currentRental.serialNumber}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Manufacturer</h3>
                  <p className="text-gray-900">{currentRental.manufacturer}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Support Contact</h3>
                  <p className="text-gray-900">1-800-ECO-RENT</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "condition":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Report Product Condition</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Select Issue Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonIssues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue.id)}
                      className={`border rounded-lg p-3 text-center transition-colors ${
                        selectedIssue === issue.id
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {issue.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Description</h3>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                />
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Upload Photos</h3>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="condition-photos"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="condition-photos"
                    className="cursor-pointer block"
                  >
                    <Camera className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">
                      Up to 5 photos (JPEG, PNG)
                    </p>
                  </label>
                </div>
                {isLoading && uploadedPhotos.length === 0 ? (
                  <div className="mt-4 flex justify-center">
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : uploadedPhotos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Uploaded ${index}`}
                          className="rounded-lg object-cover h-24 w-full"
                        />
                        <button
                          onClick={() =>
                            setUploadedPhotos(
                              uploadedPhotos.filter((_, i) => i !== index)
                            )
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitReport}
                disabled={!selectedIssue || !reportDescription || isLoading}
                className={`w-full py-3 rounded-lg font-medium ${
                  !selectedIssue || !reportDescription || isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Previous Reports</h2>
              <div className="border rounded-lg overflow-hidden">
                {conditionReports.map((report) => (
                  <div key={report.id} className="p-4 border-b flex items-center">
                    {report.status === "Resolved" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                    )}
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-gray-500">
                        {report.date} - {report.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "ecotips":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Your Environmental Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <Leaf className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-700">CO₂ Saved</h3>
                  <p className="text-2xl font-bold text-green-600">2.3 kg</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Equivalent to 18 miles of driving
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-blue-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <h3 className="font-medium text-gray-700">Waste Reduced</h3>
                  <p className="text-2xl font-bold text-blue-600">7 kg</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Manufacturing waste avoided
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-purple-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <h3 className="font-medium text-gray-700">Water Saved</h3>
                  <p className="text-2xl font-bold text-purple-600">45 L</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Compared to traditional models
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-4">Eco Tips by Category</h3>
              <div className="space-y-4">
                {ecoTips.map((category, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-800">
                        {category.category}
                      </h4>
                    </div>
                    <ul className="divide-y">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="p-4">
                          <div className="flex items-start">
                            <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                              <Leaf className="h-3 w-3 text-green-600" />
                            </div>
                            <p className="text-gray-700">{tip}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <Phone className="h-8 w-8 text-blue-500 mb-3" />
                  <h3 className="font-medium text-lg mb-2">24/7 Support Line</h3>
                  <p className="text-gray-600 mb-4">
                    Immediate assistance for urgent issues
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                    Call Now
                  </button>
                </div>
                
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="font-medium text-lg mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-4">
                    Chat with our support agents in real-time
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
                    Start Chat
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="border rounded-lg overflow-hidden">
                  <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-left">
                      How do I extend my rental period?
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-left">
                      What should I do if the product stops working?
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-left">
                      Are there any penalties for returning the product late?
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-left">
                      How is the environmental impact calculated?
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Notifications</h2>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      !notification.read ? "border-blue-200 bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-gray-700 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full border rounded-lg p-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full border rounded-lg p-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border rounded-lg p-3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={notificationPrefs.email}
                    onChange={() => setNotificationPrefs({
                      ...notificationPrefs,
                      email: !notificationPrefs.email
                    })}
                  />
                  <span>Email notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={notificationPrefs.sms}
                    onChange={() => setNotificationPrefs({
                      ...notificationPrefs,
                      sms: !notificationPrefs.sms
                    })}
                  />
                  <span>SMS alerts</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={notificationPrefs.promotions}
                    onChange={() => setNotificationPrefs({
                      ...notificationPrefs,
                      promotions: !notificationPrefs.promotions
                    })}
                  />
                  <span>Promotional offers</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={notificationPrefs.ecoTips}
                    onChange={() => setNotificationPrefs({
                      ...notificationPrefs,
                      ecoTips: !notificationPrefs.ecoTips
                    })}
                  />
                  <span>Eco tips and impact updates</span>
                </label>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className={`mt-6 w-full py-3 rounded-lg font-medium ${
                  isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Account Security</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <p className="text-gray-600 mb-3">
                    Update your account password for enhanced security
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                    Change Password
                  </button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Status: <span className="text-gray-500">Disabled</span>
                    </span>
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Login Activity</h3>
                  <p className="text-gray-600 mb-3">
                    Review recent access to your account
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">San Francisco, CA</p>
                        <p className="text-sm text-gray-500">
                          Chrome on macOS • May 15, 2023 at 2:45 PM
                        </p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        Current session
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New York, NY</p>
                        <p className="text-sm text-gray-500">
                          Safari on iOS • May 10, 2023 at 9:30 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View all activity
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-red-100">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-gray-600 text-sm">
                      Permanently remove your account and all associated data
                    </p>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm">
                    Delete Account
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Logout All Devices</h3>
                    <p className="text-gray-600 text-sm">
                      Sign out of all active sessions except this one
                    </p>
                  </div>
                  <button className="border border-red-600 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg text-sm">
                    Logout Everywhere
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: "schedule", label: "Schedule & Timeline", icon: Calendar },
    { id: "usage", label: "Usage Guidelines", icon: FileText },
    { id: "condition", label: "Condition Reports", icon: Camera },
    { id: "ecotips", label: "Eco Tips & Impact", icon: Leaf },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-green-600">EcoRental</h1>
          ) : (
            <Award className="h-8 w-8 text-green-600" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {sidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center rounded-lg p-3 ${
                      activeTab === item.id
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {sidebarOpen && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-lg p-3"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {getPageTitle()}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium">
                {userProfile?.firstName || "User"}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {isLoading && !currentRental ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default EndUserPortal;