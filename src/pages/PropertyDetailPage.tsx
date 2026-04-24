import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize2, Calendar, ChevronLeft, ChevronRight, Phone, Mail, MessageSquare, CircleCheck as CheckCircle, ArrowLeft, Share2, PlayCircle } from 'lucide-react';
import { propertyService } from '../services/api';
import { inquiryService } from '../services/api';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAuthStore } from '../store/authStore';
import { useInquiryStore } from '../store/inquiryStore';
import { formatPrice, capitalize, formatDate } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';
import { Star } from 'lucide-react';
import { reviewService } from '../services/api';
import { ScheduleVisitForm } from '../components/property/ScheduleVisitForm';
import { ContactAgentForm } from '../components/property/ContactAgentForm';
import { EMICalculator } from '../components/property/EMICalculator';
import { ChatBox } from '../components/property/ChatBox';
import type { Property } from '../types';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showChat, setShowChat] = useState(false);

  const { toggle, isFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const { addInquiry } = useInquiryStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    propertyService.getById(id).then(data => {
      setProperty(data);
      setLoading(false);
    });
    reviewService.getByProperty(id).then(setReviews);
  }, [id]);

  const handleToggleFavorite = () => {
    if (!property) return;
    toggle(property.id);
    const isFav = isFavorite(property.id);
    toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !form.message.trim()) return;
    setSubmitting(true);
    const inquiry = await inquiryService.create({
      propertyId: property.id,
      propertyTitle: property.title,
      userId: user?.id || 'guest',
      userName: form.name,
      userEmail: form.email,
      userPhone: form.phone,
      message: form.message,
    });
    addInquiry(inquiry);
    setSubmitting(false);
    setInquirySent(true);
    toast.success('Inquiry sent successfully!');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) {
      toast.error('Please log in to leave a review');
      return;
    }
    try {
      const review = await reviewService.addReview({
        userId: user.id,
        propertyId: id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add review');
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="pt-16 max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-[480px] rounded-2xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Property not found</p>
        <Button onClick={() => navigate('/properties')}>Back to Listings</Button>
      </div>
    );
  }

  const isFav = isFavorite(property.id);
  const totalImages = property.images.length;

  return (
    <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to listings</span>
        </button>

        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-slate-900 group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={imgIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              src={property.images[imgIndex]}
              alt={property.title}
              className="w-full h-[500px] object-cover"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {totalImages > 1 && (
            <>
              <button
                onClick={() => setImgIndex(i => (i - 1 + totalImages) % totalImages)}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setImgIndex(i => (i + 1) % totalImages)}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={property.type === 'sale' ? 'blue' : 'green'} className="shadow-lg">
              For {capitalize(property.type)}
            </Badge>
            {property.isFeatured && <Badge variant="amber" className="shadow-lg">Featured</Badge>}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="flex gap-2 bg-black/30 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={clsx(
                    'h-12 w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                    i === imgIndex ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="bg-black/40 backdrop-blur-md text-white text-xs rounded-full px-3 py-1.5 border border-white/10">
              {imgIndex + 1} / {totalImages}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {property.title}
                </h1>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleToggleFavorite}
                    className={clsx(
                      'p-2.5 rounded-xl border transition-all',
                      isFav
                        ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800'
                    )}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={clsx('h-5 w-5', isFav && 'fill-current')} />
                  </button>
                  <button
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all"
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                    title="Copy Link"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 px-4"
                    onClick={() => toast('Virtual Tour coming soon!', { icon: '📽️' })}
                  >
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Tour</span>
                  </button>
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                {property.location}, {property.city}, {property.state}
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-3">
                {formatPrice(property.price, property.type)}
              </p>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms === 0 ? 'Studio' : property.bedrooms },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                { icon: Maximize2, label: 'Area', value: `${property.area.toLocaleString()} ft²` },
                { icon: Calendar, label: 'Year Built', value: property.yearBuilt },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <Icon className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">About this property</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Listing Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Listing Details</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Property Type</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{property.category}</p>
                </div>
                <div>
                  <span className="text-slate-500">Status</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{property.status}</p>
                </div>
                <div>
                  <span className="text-slate-500">Listed</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{formatDate(property.createdAt)}</p>
                </div>
                <div>
                  <span className="text-slate-500">City</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{property.city}, {property.state}</p>
                </div>
              </div>
            </div>

            {/* Review System */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reviews & Ratings</h2>
                {averageRating && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{averageRating}</span>
                    <span className="text-xs text-slate-400">({reviews.length})</span>
                  </div>
                )}
              </div>

              {user && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold mb-3">Add a Review</p>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={clsx("h-6 w-6", star <= newReview.rating ? "text-yellow-500 fill-current" : "text-slate-300 dark:text-slate-700")} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell us about your experience..."
                    className="w-full px-4 py-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-3"
                    rows={3}
                  />
                  <Button type="submit" size="sm">Submit Review</Button>
                </form>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center py-8 text-slate-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="flex gap-4">
                      <img src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{review.userName}</h4>
                          <span className="text-[10px] text-slate-400">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={clsx("h-3 w-3", star <= review.rating ? "text-yellow-500 fill-current" : "text-slate-200 dark:text-slate-700")} />
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Agent Card & Contact */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-20 shadow-lg">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Listing Agent</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={property.agentAvatar}
                    alt={property.agentName}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-600"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{property.agentName}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Licensed Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href={`tel:${property.agentPhone}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Phone className="h-4 w-4" />
                    {property.agentPhone}
                  </a>
                  <a href={`mailto:${property.agentEmail}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Mail className="h-4 w-4" />
                    {property.agentEmail}
                  </a>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please log in to chat');
                        navigate('/login');
                      } else {
                        setShowChat(true);
                      }
                    }}
                    className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat with Agent
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    Quick Contact
                  </div>
                  <ContactAgentForm />
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Schedule a Visit
                  </div>
                  <ScheduleVisitForm propertyTitle={property.title} />
                </div>
              </div>
            </div>

            <EMICalculator initialAmount={property.price} />
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Modal isOpen={showInquiry} onClose={() => { setShowInquiry(false); setInquirySent(false); }} title="Contact Agent" size="lg">
        {inquirySent ? (
          <div className="text-center py-6">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Inquiry Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {property.agentName} will be in touch with you soon.
            </p>
            <Button onClick={() => { setShowInquiry(false); setInquirySent(false); }}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-500 mb-1">About</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{property.title}</p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatPrice(property.price, property.type)}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="I'm interested in this property and would like to schedule a viewing..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowInquiry(false)}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={submitting}>Send Inquiry</Button>
            </div>
          </form>
        )}
      </Modal>

      {showChat && property && (
        <ChatBox
          receiverId={property.agentId}
          receiverName={property.agentName}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
