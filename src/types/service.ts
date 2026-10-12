export interface ServiceDetail {
  id:string; name:string; title?:string; description:string; longDescription?:string;
  slug:string; category:string; type:string; featured:boolean; available:boolean;
  price?:number; basePrice?:number; maxPrice?:number; pricing:string; duration?:string;
  features:string[]; deliverables:string[]; requirements:string[]; tags:string[];
  testimonials: {id:string; clientName:string; clientRole?:string; company?:string; avatar?:string; rating:number; content:string; project?:{title:string;slug:string}}[];
}
