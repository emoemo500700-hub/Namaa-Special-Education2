"""يتحقق من ملفات Word التي يولّدها smoke.js: سلامة الضغط، فتحها بـ python-docx، وعدد صفحاتها عبر LibreOffice.
التشغيل: python3 tests/validate_docx.py <مجلد فيه ملفات .docx>"""
import sys,glob,zipfile,subprocess,os,shutil,tempfile
import docx
d=sys.argv[1] if len(sys.argv)>1 else 'tests/out';bad=0
for f in sorted(glob.glob(os.path.join(d,'*.docx'))):
    z=zipfile.ZipFile(f);assert z.testzip() is None,f
    need={'[Content_Types].xml','word/document.xml','word/styles.xml','word/header1.xml','word/footer1.xml','word/media/logo.png','word/media/wm.png'}
    miss=need-set(z.namelist())
    D=docx.Document(f);msg=f'{os.path.basename(f)}: tables={len(D.tables)} missing={sorted(miss)}'
    if shutil.which('soffice'):
        t=tempfile.mkdtemp();subprocess.run(['soffice','--headless','--convert-to','pdf','--outdir',t,f],capture_output=True,timeout=120)
        p=os.path.join(t,os.path.basename(f)[:-5]+'.pdf')
        if os.path.exists(p):
            pages=int([l for l in subprocess.run(['pdfinfo',p],capture_output=True,text=True).stdout.splitlines() if l.startswith('Pages')][0].split()[1]);msg+=f' pages={pages}'
        else:msg+=' (LibreOffice لم يحوّل الملف!)';bad+=1
    if miss:bad+=1
    print(('OK   ' if not miss else 'FAIL ')+msg)
sys.exit(1 if bad else 0)
