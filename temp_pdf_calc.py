header='%PDF-1.4\n'
obj1='1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'
obj2='2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'
obj3='3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n'
obj4='4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
stream='BT\n/F1 18 Tf 72 740 Td (ScholarsLedger Roadmap Overview) Tj\n0 -24 Td (Phase 1: SMA Foundation - 38% complete) Tj\n0 -18 Td (Phase 2: University Prep - In progress) Tj\n0 -18 Td (Next checkpoint: Checkpoint Jumat) Tj\n0 -18 Td (Sync with calendar to keep milestones on track.) Tj\nET\n'
length=len(stream.encode('latin1'))
obj5=f'5 0 obj\n<< /Length {length} >>\nstream\n{stream}endstream\nendobj\n'
parts=[header,obj1,obj2,obj3,obj4,obj5]
offsets=[]
pos=0
content=''.join(parts)
for part in parts:
    offsets.append(pos)
    pos += len(part.encode('latin1'))
startxref=len(content.encode('latin1'))
print('length', length)
print('startxref', startxref)
for i, off in enumerate(offsets, start=1):
    print(i, off)
