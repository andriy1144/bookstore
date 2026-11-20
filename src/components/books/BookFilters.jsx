import Form from 'react-bootstrap/Form';
import AppButton from '../ui/AppButton.jsx';

export default function BookFilters({
  query,
  genre,
  genres,
  availableOnly,
  onQueryChange,
  onGenreChange,
  onAvailableChange,
  onReset,
}) {
  return (
    <div className="d-flex flex-wrap gap-3 align-items-center mb-4 p-3 bg-white rounded shadow-sm">
      <Form.Group className="mb-0 flex-grow-1" style={{ minWidth: '220px' }}>
        <Form.Control
          type="search"
          placeholder="Пошук за назвою або автором..."
          aria-label="Пошук за назвою або автором"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </Form.Group>

      <Form.Select
        aria-label="Жанр"
        value={genre}
        onChange={(e) => onGenreChange(e.target.value)}
        style={{ maxWidth: '230px' }}
      >
        <option value="">Усі жанри</option>
        {genres.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Form.Select>

      <Form.Check
        type="switch"
        id="available-switch"
        label="Лише в наявності"
        checked={availableOnly}
        onChange={(e) => onAvailableChange(e.target.checked)}
      />

      <AppButton variant="secondary" onClick={onReset}>
        Скинути
      </AppButton>
    </div>
  );
}
