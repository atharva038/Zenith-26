import {motion} from "framer-motion";
import AdminLayout from "../components/AdminLayout";

const AdminSettings = () => {
  return (
    <AdminLayout title="Settings">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-12 border border-neon-orange/20 text-center"
      >
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-2xl font-bold mb-2 font-rajdhani">
          Settings
        </h2>
        <p className="text-gray-400">
          This feature is under development and will be available soon.
        </p>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminSettings;
