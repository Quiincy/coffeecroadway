export default function Map() {
  return (
    <div className="w-full h-full min-h-[400px] z-0 relative bg-zinc-900">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d81313.4357777176!2d30.43575975191062!3d50.44314168051781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce53b2d186c7%3A0x6a1a1db765f041cb!2sKyiv%2C%20Ukraine%2C%2002000!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
        width="100%" 
        height="100%" 
        style={{ border: 0, minHeight: '400px' }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map - Kyiv"
      ></iframe>
    </div>
  )
}
