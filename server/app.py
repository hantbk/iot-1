from flask import Flask, render_template, request, jsonify
import os, re, datetime
import db
from models import Device


app = Flask(__name__)

if not os.path.isfile('devices.db'):
    db.connect()

# route for landing page
# check out the template folder for the index.html file
# check out the static folder for css and js files
@app.route("/")
def index():
    return render_template("index.html")

# def isValid(email):
#     regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
#     if re.fullmatch(regex, email):
#       return True
#     else:
#       return False


@app.route("/api/createDevice", methods=['POST'])
def postRequest():
    req_data = request.get_json()
    deviceId = req_data['deviceId']
    qrCodeId = req_data['qrCodeId']
    qrCodeValue = req_data['qrCodeValue']
    dvs = [d.serialize() for d in db.view()]
    for d in dvs:
        if d['deviceId'] == deviceId:
            return jsonify({
                # 'error': '',
                'res': f'Error ⛔❌! Device with Id {deviceId} is already in db!',
                'status': '404'
            })

    d = Device(db.getNewId(), deviceId, qrCodeId, qrCodeValue)
    print('new device: ', d.serialize())
    db.insert(d)
    new_dvs = [d.serialize() for d in db.view()]
    print('devices in db: ', new_dvs)
    
    return jsonify({
                # 'error': '',
                'res': d.serialize(),
                'status': '200',
                'msg': 'Success creating a new device!👍😀'
            })


@app.route('/request', methods=['GET'])
def getRequest():
    content_type = request.headers.get('Content-Type')
    bks = [b.serialize() for b in db.view()]
    if (content_type == 'application/json'):
        json = request.json
        for b in bks:
            if b['id'] == int(json['id']):
                return jsonify({
                    # 'error': '',
                    'res': b,
                    'status': '200',
                    'msg': 'Success getting all books in library!👍😀'
                })
        return jsonify({
            'error': f"Error ⛔❌! Book with id '{json['id']}' not found!",
            'res': '',
            'status': '404'
        })
    else:
        return jsonify({
                    # 'error': '',
                    'res': bks,
                    'status': '200',
                    'msg': 'Success getting all books in library!👍😀',
                    'no_of_books': len(bks)
                })


@app.route('/request/<id>', methods=['GET'])
def getRequestId(id):
    req_args = request.view_args
    # print('req_args: ', req_args)
    bks = [b.serialize() for b in db.view()]
    if req_args:
        for b in bks:
            if b['id'] == int(req_args['id']):
                return jsonify({
                    # 'error': '',
                    'res': b,
                    'status': '200',
                    'msg': 'Success getting book by ID!👍😀'
                })
        return jsonify({
            'error': f"Error ⛔❌! Book with id '{req_args['id']}' was not found!",
            'res': '',
            'status': '404'
        })
    else:
        return jsonify({
                    # 'error': '',
                    'res': bks,
                    'status': '200',
                    'msg': 'Success getting book by ID!👍😀',
                    'no_of_books': len(bks)
                })

@app.route("/request", methods=['PUT'])
def putRequest():
    req_data = request.get_json()
    availability = req_data['available']
    title = req_data['title']
    the_id = req_data['id']
    bks = [b.serialize() for b in db.view()]
    for b in bks:
        if b['id'] == the_id:
            bk = Book(
                the_id, 
                availability, 
                title, 
                datetime.datetime.now()
            )
            print('new book: ', bk.serialize())
            db.update(bk)
            new_bks = [b.serialize() for b in db.view()]
            print('books in lib: ', new_bks)
            return jsonify({
                # 'error': '',
                'res': bk.serialize(),
                'status': '200',
                'msg': f'Success updating the book titled {title}!👍😀'
            })        
    return jsonify({
                # 'error': '',
                'res': f'Error ⛔❌! Failed to update Book with title: {title}!',
                'status': '404'
            })
    
    


@app.route('/request/<id>', methods=['DELETE'])
def deleteRequest(id):
    req_args = request.view_args
    print('req_args: ', req_args)
    bks = [b.serialize() for b in db.view()]
    if req_args:
        for b in bks:
            if b['id'] == int(req_args['id']):
                db.delete(b['id'])
                updated_bks = [b.serialize() for b in db.view()]
                print('updated_bks: ', updated_bks)
                return jsonify({
                    'res': updated_bks,
                    'status': '200',
                    'msg': 'Success deleting book by ID!👍😀',
                    'no_of_books': len(updated_bks)
                })
    else:
        return jsonify({
            'error': f"Error ⛔❌! No Book ID sent!",
            'res': '',
            'status': '404'
        })

if __name__ == '__main__':
    app.run()