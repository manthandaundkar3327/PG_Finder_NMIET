import { Router, Request, Response } from 'express';
import { INITIAL_LISTINGS } from '../data/initialData.ts';
import { PGListing } from '../types.ts';

const router = Router();

// In-memory data store for backend
let listings: PGListing[] = [...INITIAL_LISTINGS];

// GET /api/listings - Get all listings with search and filter queries
router.get('/', (req: Request, res: Response) => {
  const { query, gender, sharing, maxRent, maxDistance, foodRequired } = req.query;

  let results = [...listings];

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
    results = results.filter((item) => item.sharing === sharing);
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
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({ success: true, listing });
});

// POST /api/listings - Create new PG listing
router.post('/', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.title || !body.address || !body.contactPhone) {
    return res.status(400).json({
      success: false,
      message: 'Title, address, and contact phone are required',
    });
  }

  const newListing: PGListing = {
    id: `pg-${Date.now()}`,
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
    isAvailable: true,
    postedBy: body.postedBy || 'demo-user',
    postedByName: body.postedByName || 'Manthan (NMIET Student)',
    postedDate: 'Just now',
    description: body.description || 'Verified accommodation near NMIET',
    rules: Array.isArray(body.rules) ? body.rules : [],
    isVerified: true,
    electricityCharges: body.electricityCharges || 'Included in rent',
    noticePeriodDays: body.noticePeriodDays || 30,
    rating: 4.8,
    reviewsCount: 1,
  };

  listings.unshift(newListing);

  res.status(201).json({
    success: true,
    message: 'Vacancy listed successfully!',
    listing: newListing,
  });
});

// PUT /api/listings/:id - Update existing listing
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = listings.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  listings[index] = {
    ...listings[index],
    ...req.body,
    id, // protect ID from changing
  };

  res.json({
    success: true,
    message: 'Listing updated successfully',
    listing: listings[index],
  });
});

// PATCH /api/listings/:id/availability - Toggle availability
router.patch('/:id/availability', (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  listing.isAvailable = !listing.isAvailable;

  res.json({
    success: true,
    message: `Listing is now marked as ${listing.isAvailable ? 'Available' : 'Occupied'}`,
    isAvailable: listing.isAvailable,
  });
});

// DELETE /api/listings/:id - Delete a listing
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = listings.length;
  listings = listings.filter((l) => l.id !== id);

  if (listings.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  res.json({ success: true, message: 'Listing deleted successfully' });
});

export default router;
