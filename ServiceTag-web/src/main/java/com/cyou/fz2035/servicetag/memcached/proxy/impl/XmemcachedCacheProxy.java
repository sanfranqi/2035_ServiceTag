package com.cyou.fz2035.servicetag.memcached.proxy.impl;



import com.cyou.fz2035.servicetag.memcached.AbsCASOpt;
import com.cyou.fz2035.servicetag.memcached.casopt.XCASOperation;
import com.cyou.fz2035.servicetag.memcached.casopt.impl.DefaultCASOperation;
import com.cyou.fz2035.servicetag.memcached.proxy.ISimpleCacheProxy;
import com.cyou.fz2035.servicetag.utils.UnCaughtException;
import net.rubyeye.xmemcached.GetsResponse;
import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;

/**
 * Xmemcached缓存实现.
 * 
 * @author yangz
 * @date 2013-4-7 下午3:59:28
 */
public class XmemcachedCacheProxy implements ISimpleCacheProxy {

	private MemcachedClient client;
	/**
	 * 服务器地址列表,用空格隔开.
	 */
	private String addressList;

    /**
	 * 连接池大小.

	 */
	private int connectionPoolSize;

	@Override
	public void destroy() {
		try {
			client.shutdown();
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public <T> T get(String key) {
		try {
			return (T)client.get(key);
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public boolean add(String key, Object value) {
		try {
			return client.add(key, 0, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean set(String key, Object value) {
		try {
			return client.set(key, 0, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean delete(String key) {
		try {
			return client.delete(key);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public long count(String key, int amount) {
		try {
			return client.incr(key, amount);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public long count(String key) {
		try {
			return client.getCounter(key).get();
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public <T> T cas(String key, final AbsCASOpt<T> casOpt) {
		try {
			GetsResponse<T> response = client.gets(key);

			T t = casOpt.initValue();
			if (casOpt.isInitNewValue()) {
				t = casOpt.getNewValue(casOpt.initValue());
			}
			int max = casOpt.isRedoConflicts() ? AbsCASOpt.MAX_TRIES : 1;
			if (response == null) {
				for (int i = 0; i < max; i++) {
					if (client.add(key, casOpt.initExp(), t)) {
						return t;
					} else {
						try {
							return cas(key, casOpt);
						} catch (Exception e) {
						}
					}
				}
			} else {
                XCASOperation<T> operation = new DefaultCASOperation<T>(casOpt);
				boolean casFlag = client.cas(key, operation);
				if (casFlag) {
                    return operation.getLastValue();
                }
			}
			throw new UnCaughtException("Couldn't get a CAS in " + max
					+ " attempts.");
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	public String getAddressList() {
		return addressList;
	}

	public void setAddressList(String addressList) {
		this.addressList = addressList;
	}

	public int getConnectionPoolSize() {
		return connectionPoolSize;
	}

	public void setConnectionPoolSize(int connectionPoolSize) {
		this.connectionPoolSize = connectionPoolSize;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		try {
			XMemcachedClientBuilder builder = new XMemcachedClientBuilder(
					addressList);
			builder.setConnectionPoolSize(connectionPoolSize);
			client = builder.build();
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean add(String key, Object value, int timeOut) {
		try {
			return client.add(key, timeOut, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean set(String key, Object value, int timeOut) {
		try {
			return client.set(key, timeOut, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

}
