let images = [
  // [
  //   ['mirrorgooglecontainers/', 'kube-controller-manager', 'v1.15.1'],
  //   ['k8s.gcr.io/', 'kube-controller-manager', 'v1.15.1']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'kube-apiserver', 'v1.15.1'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'kube-scheduler', 'v1.15.1'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'kube-proxy', 'v1.15.1'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['coredns/', 'coredns', '1.5.2'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'etcd', '3.3.10-1'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'pause', '3.1'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'kubernetes-dashboard-amd64', 'v1.10.1'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['imere/', 'hyperkube', 'v1.15.1'],
  //   ['quay.io/coreos_containers/', 'hyperkube']
  // ],
  // [
  //   ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'nginx-ingress-controller', '0.25.0'],
  //   ['quay.io/kubernetes-ingress-controller/', 'nginx-ingress-controller']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'addon-resizer', '2.3'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'metrics-server', 'v0.3.3'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['mirrorgooglecontainers/', 'heapster-influxdb', 'v0.13.0'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['imere/', 'k8s-dns-sidecar', '1.15.4'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['imere/', 'k8s-dns-kube-dns', '1.15.4'],
  //   ['k8s.gcr.io/']
  // ],
  // [
  //   ['imere/', 'k8s-dns-dnsmasq-nanny', '1.15.4'],
  //   ['k8s.gcr.io/']
  // ],
];

images = [
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'pause', '3.1'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'kube-controller-manager', 'v1.15.5'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'kube-scheduler', 'v1.15.5'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'kube-proxy', 'v1.15.5'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'kube-apiserver', 'v1.15.5'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'etcd', '3.3.10'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'coredns', '1.3.1'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'kubernetes-dashboard-amd64', 'v1.10.1'],
    ['k8s.gcr.io/'],
  ],
  [
    ['registry.cn-hangzhou.aliyuncs.com/google_containers/', 'nginx-ingress-controller', '0.25.1'],
    ['quay.io/kubernetes-ingress-controller/'],
  ],
];


function hasTagRelated(image) {
  return image.length > 1;
}

function getTag(tagarr) {
  const [host, name, tag] = [
    `${tagarr[0] || ''}`,
    `${tagarr[1]}`,
    `${tagarr[2] || ''}`
  ];
  return `${host}${name}${tag ? ':' + tag : ''}`;
}

function getTagsRelated(image) {
  const ret = [];
  for (let i = 1; i < image.length; i++) {
    const [host, name, tag] = [
      `${image[i][0] || image[0][0] || ''}`,
      `${image[i][1] || image[0][1]}`,
      `${image[i][2] || image[0][2] || ''}`
    ];
    ret.push(`${host}${name}${tag ? ':' + tag : ''}`);
  }
  return ret;
}

function pull(image) {
  return `docker pull ${getTag(image[0])}`;
}

function tag(image) {
  const ret = [];
  for (const tagRelated of getTagsRelated(image)) {
    ret.push(`docker tag ${getTag(image[0])} ${tagRelated}`);
  }
  return ret;
}

function rmi(image) {
  return `docker rmi ${getTag(image[0])}`;
}


images.sort((a, b) => a[0][1].localeCompare(b[0][1]));

const array = images.map(image => {
  const ret = [];

  ret.push(pull(image));

  if (hasTagRelated(image)) {
    ret.push(...tag(image))

    ret.push(rmi(image));
  }

  ret.push('');

  return ret.join('\n');
});


for (let stmt of array)
  console.log(stmt);