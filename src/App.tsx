import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ComparisonPage } from './pages/ComparisonPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { InquiryPage } from './pages/InquiryPage';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { ManageProperties } from './pages/dashboard/ManageProperties';
import { ManageUsers } from './pages/dashboard/ManageUsers';
import { InquiriesPage } from './pages/dashboard/InquiriesPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/inquiry" element={<InquiryPage />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <DashboardLayout>
                      <Routes>
                        <Route path="/" element={<DashboardOverview />} />
                        <Route path="/properties" element={<ManageProperties />} />
                        <Route path="/users" element={<ManageUsers />} />
                        <Route path="/inquiries" element={<InquiriesPage />} />
                        <Route path="/my-properties" element={<ManageProperties />} />
                        <Route path="/add-property" element={<ManageProperties />} />
                        <Route path="/saved" element={<FavoritesPage />} />
                        <Route path="/my-inquiries" element={<InquiriesPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </DashboardLayout>
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
