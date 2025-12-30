import { cn } from "@/lib/utils";
const Title = ({

    children, 
    className
}:{
    children: React.ReactNode; 
    className?: string;
})=>{
    return (
        <h2 className={cn(
            "text-2xl md:text-3xl font-bold tracking-wide text-shop_btn_dark_green font-sans", 
            className)}
        >
            {children}
        </h2>
    );
}

const SubTitle = ({

    children, 
    className
}:{
    children: React.ReactNode; 
    className?: string;
})=>{
    return (
        <h3 className={cn(
            "font-bold text-gray-900 font-sans", 
            className)}
        >
            {children}
        </h3>
    );
}

const SubText = ({
    children, 
    className
}:{
    children: React.ReactNode; 
    className?: string;
})=>{
        return <p className={cn("text-gray-600 text-sm", className)}>{children}</p>
    }
export { Title,SubTitle, SubText };