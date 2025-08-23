import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def create_pdf_from_html():
    """Create PDF from HTML file"""
    try:
        # Try importing weasyprint
        import weasyprint
        
        html_file = "Portfolio-Content-Management-Guide.html"
        pdf_file = "Portfolio-Content-Management-Guide.pdf"
        
        if not os.path.exists(html_file):
            print(f"Error: {html_file} not found!")
            return False
            
        print("Generating PDF from HTML...")
        weasyprint.HTML(filename=html_file).write_pdf(pdf_file)
        print(f"✅ PDF created successfully: {pdf_file}")
        return True
        
    except ImportError:
        print("WeasyPrint not found. Installing...")
        try:
            install_package("weasyprint")
            import weasyprint
            
            html_file = "Portfolio-Content-Management-Guide.html"
            pdf_file = "Portfolio-Content-Management-Guide.pdf"
            
            print("Generating PDF from HTML...")
            weasyprint.HTML(filename=html_file).write_pdf(pdf_file)
            print(f"✅ PDF created successfully: {pdf_file}")
            return True
            
        except Exception as e:
            print(f"Failed to install or use WeasyPrint: {e}")
            
            # Try alternative method with pdfkit
            try:
                print("Trying alternative method with pdfkit...")
                install_package("pdfkit")
                import pdfkit
                
                html_file = "Portfolio-Content-Management-Guide.html"
                pdf_file = "Portfolio-Content-Management-Guide.pdf"
                
                # pdfkit requires wkhtmltopdf to be installed
                pdfkit.from_file(html_file, pdf_file)
                print(f"✅ PDF created successfully: {pdf_file}")
                return True
                
            except Exception as e2:
                print(f"pdfkit also failed: {e2}")
                print("Please install wkhtmltopdf or use browser print-to-PDF feature")
                return False

if __name__ == "__main__":
    create_pdf_from_html()