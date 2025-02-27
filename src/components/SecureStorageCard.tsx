
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Lock, Shield, Fingerprint, KeyRound, Upload, Database, FileText, Check, X } from "lucide-react";

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: string;
  encrypted: boolean;
  date: string;
}

const mockFiles: StoredFile[] = [
  {
    id: "file-1",
    name: "Q1_Financial_Report.pdf",
    type: "PDF",
    size: "2.4 MB",
    encrypted: true,
    date: "2023-12-15"
  },
  {
    id: "file-2",
    name: "Budget_2024.xlsx",
    type: "Spreadsheet",
    size: "1.8 MB",
    encrypted: true,
    date: "2024-01-05"
  },
  {
    id: "file-3",
    name: "Tax_Documents.zip",
    type: "Archive",
    size: "5.2 MB",
    encrypted: true,
    date: "2024-02-20"
  }
];

const SecureStorageCard = () => {
  const [files, setFiles] = useState<StoredFile[]>(mockFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleUpload = () => {
    if (!uploadName.trim()) {
      toast("Please enter a file name", {
        description: "A name is required to upload a file."
      });
      return;
    }
    
    setIsUploading(true);
    toast("Encrypting file...", {
      description: "Your file is being securely encrypted."
    });
    
    // Simulate file upload and encryption process
    setTimeout(() => {
      const newFile: StoredFile = {
        id: `file-${Math.random().toString(36).substring(2, 9)}`,
        name: uploadName,
        type: uploadName.split('.').pop()?.toUpperCase() || "Unknown",
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        encrypted: true,
        date: new Date().toISOString().split('T')[0]
      };
      
      setFiles([newFile, ...files]);
      setIsUploading(false);
      setUploadName("");
      
      toast.success("File uploaded successfully", {
        description: "Your file has been encrypted and stored securely."
      });
    }, 2000);
  };

  const handleDownload = (fileId: string) => {
    setShowVerification(true);
  };

  const verifyAndDownload = () => {
    if (verificationCode !== "123456") {
      toast.error("Invalid verification code", {
        description: "Please enter the correct code."
      });
      return;
    }
    
    toast.success("Verification successful", {
      description: "Your file is being decrypted and downloaded."
    });
    
    setTimeout(() => {
      setVerificationCode("");
      setShowVerification(false);
    }, 1000);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Secure Cloud Storage
            </CardTitle>
            <CardDescription>
              Military-grade encryption for your financial documents
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Lock className="h-3 w-3 mr-1" />
              AES-256
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Fingerprint className="h-3 w-3 mr-1" />
              2FA Enabled
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Financial Document</DialogTitle>
              <DialogDescription>
                Your file will be encrypted before being stored in the cloud
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filename" className="text-right">
                  File Name
                </Label>
                <Input
                  id="filename"
                  placeholder="Enter file name"
                  className="col-span-3"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="encryption" className="text-right">
                  Encryption
                </Label>
                <div className="col-span-3 flex items-center">
                  <Badge className="bg-green-100 text-green-800">
                    <Lock className="h-3 w-3 mr-1" />
                    AES-256 Encryption
                  </Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleUpload}
                disabled={isUploading || !uploadName.trim()}
              >
                {isUploading ? "Encrypting..." : "Upload & Encrypt"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showVerification && (
          <Dialog open={showVerification} onOpenChange={setShowVerification}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                  Please enter the verification code sent to your device
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    placeholder="123456"
                    className="col-span-3"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Hint: For demo purposes, the code is 123456
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowVerification(false)} variant="outline">Cancel</Button>
                <Button onClick={verifyAndDownload}>Verify</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/40 p-2 flex items-center justify-between">
            <p className="text-sm font-medium">Encrypted Documents</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              Secure Storage
            </div>
          </div>
          <div className="divide-y">
            {files.map((file) => (
              <div key={file.id} className="p-3 flex items-center justify-between hover:bg-muted/20">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{file.type}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDownload(file.id)}
                >
                  <KeyRound className="h-4 w-4" />
                  <span className="sr-only">Decrypt and download</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-muted/20 rounded-md">
          <div className="font-medium text-sm mb-2">Security Status</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-green-600" />
                <span>AES-256 Encryption</span>
              </div>
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Fingerprint className="h-4 w-4 mr-2 text-green-600" />
                <span>Two-Factor Authentication</span>
              </div>
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-amber-500" />
                <span>OAuth2 Connection</span>
              </div>
              <X className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <span>Powered by AES-256 encryption</span>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Security settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SecureStorageCard;
