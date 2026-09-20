import Form from 'react-bootstrap/Form';
import AppButton from '../ui/AppButton.jsx';

export default function BookFilters({ query, availableOnly, onQueryChange, onAvailableChange, onReset }) {
  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-4 p-3 bg-white rounded shadow-sm">
      <Form.Group className="mb-0 flex-grow-1" style={{ minWidth: '200px' }}>
        <Form.Control 
          type="search" 
          placeholder="Пошук за назвою..." 
          value={query} 
          onChange={(e) => onQueryChange(e.target.value)} 
        />
      </Form.Group>
      
      <Form.Check 
        type="switch" 
        id="available-switch" 
        label="Лише в наявності" 
        checked={availableOnly} 
        onChange={(e) => onAvailableChange(e.target.checked)} 
      />
      
      <AppButton variant="secondary" onClick={onReset}>Скинути</AppButton>
    </div>
  );
}