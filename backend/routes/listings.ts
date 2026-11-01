import { Router, Request, Response } from 'express';
import { dataStore } from '../data/dataStore.ts';
import { PGListing } from '../types.ts';

const router = Router();

// GET /api/listings - Get all listings with search and filter queries
router.get('/', (req: Request, res: Response) => {
  const { query, gender, sharing, maxRent, maxDistance, foodRequired } = req.query;

  let results = dataStore.getListings();

  if (typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.landmark.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  if (gender && gender !== 'all') {
    results = results.filter((item) => item.type === gender);
  }

  if (req.query.roomType && req.query.roomType !== 'all') {
    results = results.filter((item) => item.roomType === req.query.roomType);
  }

  if (sharing && sharing !== 'all') {
    results = results.filter((item) => String(item.sharing) === String(sharing));
  }

  if (maxRent) {
    const rentNum = Number(maxRent);
    if (!isNaN(rentNum)) {
      results = results.filter((item) => item.rent <= rentNum);
    }
  }

  if (maxDistance) {
    const distNum = Number(maxDistance);
    if (!isNaN(distNum)) {
      results = results.filter((item) => item.distanceMeters <= distNum);
    }
  }

  if (foodRequired === 'true') {
    results = results.filter((item) => item.foodOption.toLowerCase().includes('included'));
  }

  res.json({
    success: true,
    total: results.length,
    listings: results,
  });
});

// GET /api/listings/:id - Get listing by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = dataStore.getListingById(id);

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({ success: true, listing });
});

// POST /api/listings - Create new PG listing and write directly to file
router.post('/', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.title || !body.address || !body.contactPhone) {
    return res.status(400).json({
      success: false,
      message: 'Title, address, and contact phone are required',
    });
  }

  // Format today's real date, e.g. "01 Nov 2026"
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const newListing: PGListing = {
    id: body.id || `pg-${Date.now()}`,
    title: body.title,
    type: body.type || 'boys',
    sharing: body.sharing || 'double',
    roomType: body.roomType || '2 BHK',
    rent: Number(body.rent) || 3500,
    deposit: Number(body.deposit) || 4000,
    distanceMeters: Number(body.distanceMeters) || 500,
    address: body.address,
    landmark: body.landmark || 'Near NMIET Campus',
    foodOption: body.foodOption || 'Available nearby',
    amenities: Array.isArray(body.amenities) ? body.amenities : ['Wi-Fi'],
    images: body.images || [],
    contactName: body.contactName || 'Host Contact',
    contactPhone: body.contactPhone,
    contactWhatsapp: body.contactWhatsapp || body.contactPhone,
    isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : true,
    postedBy: body.postedBy || 'demo-user',
    postedByName: body.postedByName || 'Manthan (NMIET Student)',
    postedDate: body.postedDate || formattedToday,
    description: body.description || 'Verified accommodation near NMIET',
    rules: Array.isArray(body.rules) ? body.rules : [],
    isVerified: body.isVerified !== undefined ? Boolean(body.isVerified) : true,
    electricityCharges: body.electricityCharges || 'Included in rent',
    noticePeriodDays: body.noticePeriodDays || 30,
    rating: body.rating || 4.8,
    reviewsCount: body.reviewsCount || 1,
  };

  const created = dataStore.addListing(newListing);

  res.status(201).json({
    success: true,
    message: 'Vacancy listed successfully and saved to backend data file!',
    listing: created,
  });
});

// PUT /api/listings/:id - Update existing listing and write directly to file
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = dataStore.updateListing(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({
    success: true,
    message: 'Listing updated successfully and saved to backend data file',
    listing: updated,
  });
});

// PATCH /api/listings/:id/availability - Toggle availability and write to file
router.patch('/:id/availability', (req: Request, res: Response) => {
  const { id } = req.params;
  const isAvailable = dataStore.toggleAvailability(id);

  if (isAvailable === null) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({
    success: true,
    message: `Listing is now marked as ${isAvailable ? 'Available' : 'Occupied'}`,
    isAvailable,
  });
});

// PATCH /api/listings/:id/verified - Toggle verified status and write to file
router.patch('/:id/verified', (req: Request, res: Response) => {
  const { id } = req.params;
  const isVerified = dataStore.toggleVerified(id);

  if (isVerified === null) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({
    success: true,
    message: `Listing verification set to ${isVerified}`,
    isVerified,
  });
});

// DELETE /api/listings/:id - Delete a listing and write to file
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = dataStore.deleteListing(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({ success: true, message: 'Listing deleted successfully and removed from backend data file' });
});

export default router;
