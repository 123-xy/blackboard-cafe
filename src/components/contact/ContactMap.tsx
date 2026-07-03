export default function ContactMap() {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2545428733!2d78.37265!3d17.4504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91cbde02392b%3A0x7cf3e62bbaa2cce4!2sBlackboard%20Cafe!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Blackboard Café Location"
        />
      </div>
      <a
        href="https://maps.app.goo.gl/cuRqMjawa7Q9wQ9J8"
        target="_blank"
        rel="noopener"
        className="mt-3 block text-center text-[13px] font-semibold text-gold-text no-underline"
      >
        Open in Google Maps →
      </a>
    </div>
  );
}
