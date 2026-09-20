import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import AppButton from '../ui/AppButton.jsx';

export default function BookCard({ book, selected, onSelect }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Card className={`h-100 shadow-sm ${selected ? 'border-primary border-2' : 'border-0'}`}>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">{book.author}</Card.Subtitle>
        
        <Card.Text>
          <strong>Жанр:</strong> {book.genre} <br/>
          <strong>Ціна:</strong> <span className="text-danger fs-5 fw-bold">{book.price} ₴</span>
        </Card.Text>

        {detailsOpen && <Card.Text className="text-secondary">{book.description}</Card.Text>}
        
        <div className="mt-auto">
          <AvailabilityBadge available={book.available} />
          
          <div className="d-flex gap-2 mt-3">
            <AppButton variant="secondary" onClick={() => setDetailsOpen(prev => !prev)}>
              {detailsOpen ? 'Згорнути' : 'Опис'}
            </AppButton>
            
            <AppButton 
              variant="primary" 
              disabled={!book.available}
              onClick={() => onSelect(book.id)}
            >
              {selected ? 'Обрано' : 'Обрати'}
            </AppButton>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}