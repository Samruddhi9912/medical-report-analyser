import os
import sys
import uvicorn

if __name__ == "__main__":
    # Ensure current directory is in Python path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)

    print("=" * 70)
    print(" ClariMed - Medical Report Understanding & Patient Assistance System")
    print("=" * 70)
    print(" Backend APIs:  http://localhost:8000/api/v1")
    print(" Interactive Docs: http://localhost:8000/docs")
    print(" Web Interface: http://localhost:8000/app/")
    print("=" * 70)
    print("Press Ctrl+C to stop the server.")

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)
