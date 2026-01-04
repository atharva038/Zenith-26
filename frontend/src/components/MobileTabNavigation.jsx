import {motion} from "framer-motion";

const MobileTabNavigation = ({activeTab, onTabChange}) => {
  const tabs = [
    {id: "analytics", label: "Analytics", icon: "📊"},
    {id: "registrations", label: "Registrations", icon: "📋"},
  ];

  return (
    <div className="sticky top-20 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 md:hidden">
      <div className="flex items-center justify-around p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex-1 px-4 py-3 text-center transition-colors"
          >
            {/* Active indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                transition={{type: "spring", bounce: 0.2, duration: 0.6}}
              />
            )}

            {/* Tab content */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="text-2xl">{tab.icon}</span>
              <span
                className={`text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-white" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </div>

            {/* Active bottom border */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBorder"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                transition={{type: "spring", bounce: 0.2, duration: 0.6}}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileTabNavigation;
