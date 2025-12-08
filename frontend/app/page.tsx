"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 scroll-smooth">
      
      {/* --- 1. NAVBAR (Sticky & Glassmorphism) --- */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
             <span className="text-3xl">🚀</span>
             <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">EduStream</span>
          </div>
          
          <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-600">
            <a href="#courses" className="hover:text-indigo-600 transition">Courses</a>
            <a href="#demo" className="hover:text-indigo-600 transition">Live Demo</a>
            <a href="#ai-tutor" className="hover:text-indigo-600 transition">AI Tutor</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Plans</a>
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push('/login')} className="text-gray-700 font-bold hover:text-indigo-600">Log In</button>
            <button onClick={() => router.push('/register')} className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition transform hover:scale-105">
              Join for Free
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION (With Animated Blobs) --- */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 border border-orange-200">
               🔥 New Python Batch Starting Tomorrow
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Master Coding with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                AI-Powered Tutors
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Get instant doubt resolution with Gemini AI, access premium video libraries, and get certified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => router.push('/register')} className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Get Started Free ⚡
              </button>
              <a href="#demo" className="px-8 py-4 bg-white text-gray-800 border border-gray-200 text-lg font-bold rounded-xl shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <span>▶</span> Watch Demo
              </a>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
               <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt=""/>
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt=""/>
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/86.jpg" alt=""/>
               </div>
               <p>Joined by 10,000+ Students</p>
            </div>
          </div>

          {/* Right Image (Professional Stock Photo with Blobs) */}
          <div className="relative">
            {/* Animated Blobs */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" 
              alt="Students Learning" 
              className="relative rounded-2xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500"
            />
            
            {/* Floating Stats Card */}
            <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
               <div className="bg-green-100 text-green-600 p-2 rounded-lg">🎓</div>
               <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Placement Rate</p>
                  <p className="text-xl font-bold">94%</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. OFFER TICKER (Marquee) --- */}
      <div className="bg-yellow-400 text-black py-3 overflow-hidden font-bold text-sm tracking-wide border-y border-yellow-500">
        <div className="animate-marquee whitespace-nowrap">
           🎉 SPECIAL OFFER: Get 50% OFF on Premium Plan! Use Code: <span className="bg-black text-white px-2 py-1 rounded mx-1">EDUPRO50</span> •  Valid till Sunday Midnight  •  Enroll in Python Masterclass Today!  •  New ReactJS Batch Starting Soon! •
        </div>
      </div>

      {/* --- 4. POPULAR COURSES (Grid) --- */}
      <section id="courses" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Top Rated</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Explore Our Best Courses</h2>
          <p className="text-gray-500 mt-4">Hand-picked courses to help you land your dream job.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <CourseCard 
              image="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              category="Programming"
              title="Python for Absolute Beginners"
              rating="4.8" students="5.2k" price="₹499" oldPrice="₹1999" tag="Best Seller"
           />
           <CourseCard 
              image="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              category="Web Development"
              title="Full Stack Web Dev (MERN)"
              rating="4.9" students="3.8k" price="₹699" oldPrice="₹2499" tag="Trending"
           />
           <CourseCard 
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              category="Data Science"
              title="Data Science & Machine Learning"
              rating="4.7" students="2.1k" price="₹599" oldPrice="₹2199"
           />
        </div>
        
        <div className="text-center mt-12">
           <button onClick={() => router.push('/dashboard')} className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-full hover:bg-indigo-600 hover:text-white transition">View All Courses →</button>
        </div>
      </section>

      {/* --- 5. AI TUTOR HIGHLIGHT (Feature Section) --- */}
      <section id="ai-tutor" className="py-20 bg-gray-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600 opacity-10 rounded-l-full blur-3xl"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
               <div className="inline-block bg-indigo-500/20 text-indigo-300 px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-indigo-500/50">
                  Powered by Google Gemini 2.0
               </div>
               <h2 className="text-4xl font-bold mb-6 leading-tight">Stuck on a Bug? <br/> Ask our AI Tutor Instantly.</h2>
               <p className="text-gray-400 text-lg mb-8">
                  Don't wait for office hours. Our AI Tutor is available 24/7 to debug your code, explain concepts, and generate quizzes tailored just for you.
               </p>
               
               <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                     <div className="bg-green-500/20 text-green-400 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                     <span>Instant Doubt Resolution</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <div className="bg-green-500/20 text-green-400 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                     <span>Code Debugging Assistant</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <div className="bg-green-500/20 text-green-400 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                     <span>Personalized Learning Path</span>
                  </li>
               </ul>

               <button onClick={() => router.push('/register')} className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-white/20">
                  Try AI Tutor for Free
               </button>
            </div>

            {/* Chatbot Simulation UI */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl relative">
               <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                  Live Preview
               </div>
               <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-end">
                     <div className="bg-indigo-600 text-white p-3 rounded-lg rounded-br-none max-w-xs shadow-md">
                        Explain Python Loops please!
                     </div>
                  </div>
                  <div className="flex justify-start">
                     <div className="bg-gray-700 text-gray-200 p-3 rounded-lg rounded-bl-none max-w-sm shadow-md">
                        🤖 <b>AI Tutor:</b> Sure! A loop is used to repeat a block of code. For example, a <code>for</code> loop iterates over a sequence.
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <div className="bg-indigo-600 text-white p-3 rounded-lg rounded-br-none max-w-xs shadow-md">
                        Give me an example?
                     </div>
                  </div>
                  <div className="flex justify-start">
                     <div className="bg-gray-700 text-gray-200 p-3 rounded-lg rounded-bl-none max-w-sm shadow-md">
                        <pre className="bg-black/30 p-2 rounded mt-1 text-xs text-green-400">
{`for x in "banana":
  print(x)`}
                        </pre>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 6. DEMO CLASS PREVIEW --- */}
      <section id="demo" className="py-20 px-6 bg-indigo-50">
         <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Experience a Live Class</h2>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">See how our expert instructors teach complex topics with ease. Join live sessions and interact in real-time.</p>
            
            <div className="relative aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden group cursor-pointer border-4 border-white" onClick={() => setIsVideoPlaying(true)}>
               {!isVideoPlaying ? (
                  <>
                     <img 
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Classroom" 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                              <span className="text-indigo-600 text-4xl ml-2">▶</span>
                           </div>
                        </div>
                     </div>
                  </>
               ) : (
                  <iframe 
                    className="w-full h-full" 
                    src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1" 
                    title="Demo Video" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
               )}
            </div>
         </div>
      </section>

      {/* --- 7. TESTIMONIALS --- */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Students Say 💬</h2>
           <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard 
                name="Rahul Sharma" role="Software Engineer @ Google" img="https://randomuser.me/api/portraits/men/32.jpg"
                text="The Python Masterclass changed my career. The AI Tutor helped me debug my code at 2 AM! Worth every penny." 
              />
              <TestimonialCard 
                name="Priya Patel" role="Data Scientist" img="https://randomuser.me/api/portraits/women/44.jpg"
                text="I loved the Live Classes. The instructor explains complex ML concepts very simply. Highly recommended for beginners!" 
              />
              <TestimonialCard 
                name="Amit Singh" role="Freelancer" img="https://randomuser.me/api/portraits/men/86.jpg"
                text="Best investment ever. The Premium notes and certification helped me land my first international client." 
              />
           </div>
        </div>
      </section>

      {/* --- 8. FAQ SECTION --- */}
      <section className="py-20 bg-gray-50 px-6">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
               <FAQItem question="Can I access the course on mobile?" answer="Yes! EduStream works perfectly on Mobile, Tablet, and Desktop. You can learn on the go." />
               <FAQItem question="Is the certificate valid for jobs?" answer="Absolutely. Our certificates are recognized by top tech companies and valid for your LinkedIn profile." />
               <FAQItem question="What if I have doubts?" answer="You can use our 24/7 AI Tutor or ask in the Live Class chat directly to the instructor." />
               <FAQItem question="Is there a refund policy?" answer="Yes, we offer a 7-day money-back guarantee if you are not satisfied with the course content." />
            </div>
         </div>
      </section>

      {/* --- 9. FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 border-t border-gray-800">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
               <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🚀</span> EduStream
               </h3>
               <p className="text-sm leading-relaxed">
                  Empowering students with AI-driven education. Learn, Practice, and Succeed with the best tools available.
               </p>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Courses</h4>
               <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition">Python Masterclass</a></li>
                  <li><a href="#" className="hover:text-white transition">Web Development</a></li>
                  <li><a href="#" className="hover:text-white transition">Data Science</a></li>
                  <li><a href="#" className="hover:text-white transition">Machine Learning</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Company</h4>
               <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Stay Updated</h4>
               <p className="text-xs mb-3">Subscribe to get latest offers and tutorials.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="Enter email" className="bg-gray-800 border-none rounded px-3 py-2 w-full text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Go</button>
               </div>
            </div>
         </div>
         <div className="text-center mt-12 pt-8 border-t border-gray-800 text-sm">
            &copy; 2025 EduStream Inc. All rights reserved. Made with ❤️ for Students.
         </div>
      </footer>

    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---

function CourseCard({ image, category, title, rating, students, price, oldPrice, tag }: any) {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition duration-300 relative group">
         {tag && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded shadow-md z-10 uppercase tracking-wider">
               {tag}
            </div>
         )}
         <div className="h-48 overflow-hidden relative">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
         </div>
         <div className="p-6">
            <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">{category}</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-snug">{title}</h3>
            
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
               <span className="text-yellow-500 font-bold flex items-center">★ {rating}</span>
               <span>• {students} students</span>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
               <div>
                  <span className="font-bold text-xl text-gray-900">{price}</span>
                  <span className="text-sm text-gray-400 line-through ml-2">{oldPrice}</span>
               </div>
               <button className="text-indigo-600 font-bold text-sm hover:underline hover:text-indigo-800 transition">View Details</button>
            </div>
         </div>
      </div>
   );
}

function TestimonialCard({ name, role, text, img }: any) {
   return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
         <div className="flex items-center gap-4 mb-4">
            <img src={img} alt={name} className="w-12 h-12 rounded-full border border-gray-200" />
            <div>
               <h4 className="font-bold text-gray-900">{name}</h4>
               <p className="text-xs text-indigo-600 font-bold uppercase">{role}</p>
            </div>
         </div>
         <p className="text-gray-600 italic leading-relaxed">"{text}"</p>
         <div className="text-yellow-400 mt-4 text-sm tracking-widest">★★★★★</div>
      </div>
   )
}

function FAQItem({ question, answer }: any) {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
         <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 font-bold flex justify-between items-center hover:bg-gray-50 transition text-gray-800">
            {question}
            <span className={`text-indigo-600 text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
         </button>
         <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40" : "max-h-0"}`}>
            <div className="p-4 border-t border-gray-100 text-gray-600 bg-gray-50 text-sm leading-relaxed">
               {answer}
            </div>
         </div>
      </div>
   )
}