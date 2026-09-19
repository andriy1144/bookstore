import Button from 'react-bootstrap/Button';

export default function AppButton({ children, type = 'button', variant = 'primary', disabled = false, onClick }) {
  // Відображаємо наш variant на класи Bootstrap
  const bootstrapVariant = variant === 'secondary' ? 'outline-primary' : 'primary';
  
  return (
    <Button type={type} variant={bootstrapVariant} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}