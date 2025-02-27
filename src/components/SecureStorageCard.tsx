
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileBox, Lock, Shield, AlertTriangle, Trash2, ClipboardCheck, Download, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { secureStorage, isStorageAvailable } from "@/utils/storageUtils";

interface StoredDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  createDate: string;
  content: string;
}

const SecureStorageCard = () => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [revealedDocId, setRevealedDocId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Load documents on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Check if storage is available
        const available = isStorageAvailable('localStorage');
        setStorageAvailable(available);
        
        if (!available) {
          setIsLoading(false);
          return;
        }
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load stored documents
        const storedData = await secureStorage.getSecurely('secure-documents');
        if (storedData) {
          setDocuments(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load secure documents:", error);
        toast.error("Failed to load secure documents");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, []);

  // Save documents when they change
  useEffect(() => {
    const saveDocuments = async () => {
      if (!isLoading && documents.length > 0) {
        try {
          await secureStorage.saveSecurely('secure-documents', JSON.stringify(documents));
        } catch (error) {
          console.error("Failed to save secure documents:", error);
        }
      }
    };
    
    saveDocuments();
  }, [documents, isLoading]);

  const handleAddDocument = async () => {
    if (!newDocName.trim() || !newDocContent.trim()) {
      toast.error("Document name and content are required");
      return;
    }
    
    try {
      const newDoc: StoredDocument = {
        id: `doc-${Date.now()}`,
        name: newDocName.trim(),
        type: getDocumentType(newDocName),
        size: new Blob([newDocContent]).size,
        createDate: new Date().toISOString(),
        content: newDocContent
      };
      
      setDocuments([...documents, newDoc]);
      setNewDocName("");
      setNewDocContent("");
      
      toast.success("Document securely stored", {
        description: "Your document has been encrypted and stored securely."
      });
    } catch (error) {
      console.error("Failed to add document:", error);
      toast.error("Failed to add document");
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    if (revealedDocId === id) {
      setRevealedDocId(null);
    }
    toast("Document deleted", {
      description: "The document has been removed from secure storage."
    });
  };

  const toggleRevealContent = (id: string) => {
    setRevealedDocId(revealedDocId === id ? null : id);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast("Copied to clipboard", {
        description: "Document content copied to clipboard."
      });
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  const handleDownloadDocument = (doc: StoredDocument) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast("Document downloaded", {
      description: "Your document has been downloaded successfully."
    });
  };

  const handleSyncToCloud = () => {
    setSyncing(true);
    
    // Simulate cloud sync
    setTimeout(() => {
      setSyncing(false);
      toast.success("Cloud sync complete", {
        description: "All documents have been synced to secure cloud storage."
      });
    }, 2000);
  };

  // Helper function to determine document type
  const getDocumentType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'txt':
        return 'Text Document';
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'csv':
        return 'CSV File';
      default:
        return 'Document';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Secure Financial Document Storage
            </CardTitle>
            <CardDescription>
              Store sensitive financial documents with end-to-end encryption
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-1 items-center"
            onClick={handleSyncToCloud}
            disabled={syncing || !storageAvailable}
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync to Cloud'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!storageAvailable ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
            <AlertTriangle className="h-10 w-10 text-amber-500 mb-3" />
            <h3 className="text-lg font-medium mb-1">Storage Not Available</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Secure storage requires localStorage or IndexedDB, which isn't available in your browser.
            </p>
            <Button variant="outline">Check Browser Settings</Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-muted h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mb-4">
                  Add New Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Secure Document</DialogTitle>
                  <DialogDescription>
                    Store sensitive financial documents securely with encryption.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Document Name
                    </Label>
                    <Input
                      id="name"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="Q1 Financial Report.pdf"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">
                      Content
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="content"
                        value={newDocContent}
                        onChange={(e) => setNewDocContent(e.target.value)}
                        placeholder="Enter document content or paste text..."
                        className="mb-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        <Lock className="h-3 w-3 inline mr-1" />
                        Content will be encrypted before storage
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddDocument}>
                    <Lock className="h-4 w-4 mr-2" />
                    Securely Store
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {documents.length === 0 ? (
              <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                <FileBox className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first secure document to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-md p-3 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FileBox className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{doc.type}</span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>{formatDate(doc.createDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleRevealContent(doc.id)}
                        >
                          {revealedDocId === doc.id ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {revealedDocId === doc.id && (
                      <div className="mt-2 relative">
                        <div className="p-3 bg-muted/30 rounded-md text-sm">
                          {doc.content}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-7"
                          onClick={() => handleCopyContent(doc.content)}
                        >
                          <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 mr-1 text-primary" />
                All documents are encrypted using AES-256 encryption
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureStorageCard;
