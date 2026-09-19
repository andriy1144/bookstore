import Badge from 'react-bootstrap/Badge';

export default function AvailabilityBadge({ available }) {
  return (
    <Badge bg={available ? 'success' : 'secondary'} className="fs-6 mb-3">
      {available ? 'В наявності' : 'Очікується'}
    </Badge>
  );
}